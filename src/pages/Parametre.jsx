import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import {
    User, Bell, Lock, Globe, Moon, Sun, Mail, Shield,
    Smartphone, Download, Trash2, Eye, EyeOff, Save,
    AlertCircle, CheckCircle, Palette, Clock, Database,
    Key, FileText, Radio, Cog, Crown, ArrowLeftRight, XCircle
} from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function Parametre() {
    const { user, token, logout, setUser, isChefDept, isAdmin } = useAuth()
    const { darkMode, setDarkMode, language, setLanguage, t } = useApp()

    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#3b82f6')
    const [timezone, setTimezone] = useState(() => localStorage.getItem('timezone') || 'Africa/Algiers')
    const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('dateFormat') || 'DD/MM/YYYY')
    const [emailNotif, setEmailNotif] = useState(() => JSON.parse(localStorage.getItem('emailNotifications') ?? 'true'))
    const [pushNotif, setPushNotif] = useState(() => JSON.parse(localStorage.getItem('pushNotifications') ?? 'true'))
    const [soundEnabled, setSoundEnabled] = useState(() => JSON.parse(localStorage.getItem('soundEnabled') ?? 'true'))
    const [notifPrefs, setNotifPrefs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('notificationPrefs')) || defNotif() }
        catch { return defNotif() }
    })
    const [userMode, setUserMode] = useState(
        localStorage.getItem('userMode') || 'employee'
    )

    function defNotif() {
        return { tasks: true, messages: true, posts: true, leaves: true, surveys: true, mentions: true }
    }

    const [profile, setProfile] = useState({
        full_name: user?.full_name || '', email: user?.email || '',
        phone: user?.phone || '', position: user?.position || '', department: user?.department || '',
    })
    const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' })
    const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })

    const flash = (type, msg) => {
        type === 'success' ? (setSuccess(msg), setError('')) : (setError(msg), setSuccess(''))
        setTimeout(() => { setSuccess(''); setError('') }, 4000)
    }

    const handleSwitchMode = () => {
        const newMode = userMode === 'employee' ? 'chef' : 'employee'
        setUserMode(newMode)
        localStorage.setItem('userMode', newMode)
        window.dispatchEvent(new Event('modeChanged'))
    }

    const handleSaveProfile = async () => {
        if (!profile.full_name.trim()) { flash('error', t('nameRequired')); return }
        setLoading(true)
        try {
            const res = await axios.put(
                `${API_URL}/users/${user.id}`,
                { full_name: profile.full_name.trim(), phone: profile.phone.trim(), position: profile.position.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUser(res.data)
            localStorage.setItem('currentUser', JSON.stringify(res.data))
            setProfile({ full_name: res.data.full_name || '', email: res.data.email || '', phone: res.data.phone || '', position: res.data.position || '', department: res.data.department || '' })
            flash('success', t('profileUpdated'))
        } catch (e) { flash('error', e.response?.data?.error || 'Erreur serveur') }
        finally { setLoading(false) }
    }

    const handleChangePassword = async () => {
        if (!pwd.current) { flash('error', t('enterCurrentPwd')); return }
        if (pwd.new !== pwd.confirm) { flash('error', t('passwordMismatch')); return }
        if (pwd.new.length < 8) { flash('error', t('passwordTooShort')); return }
        setLoading(true)
        try {
            await axios.post(
                `${API_URL}/auth/change-password`,
                { current_password: pwd.current, new_password: pwd.new },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPwd({ current: '', new: '', confirm: '' })
            flash('success', t('passwordChanged'))
        } catch (e) { flash('error', e.response?.data?.error || 'Erreur serveur') }
        finally { setLoading(false) }
    }

    const handleSavePreferences = () => {
        localStorage.setItem('timezone', timezone)
        localStorage.setItem('dateFormat', dateFormat)
        localStorage.setItem('emailNotifications', JSON.stringify(emailNotif))
        localStorage.setItem('pushNotifications', JSON.stringify(pushNotif))
        localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled))
        localStorage.setItem('accentColor', accentColor)
        localStorage.setItem('notificationPrefs', JSON.stringify(notifPrefs))
        flash('success', t('prefsSaved'))
    }

    const handleExportData = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/users/export-data`, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement('a')
            a.href = url
            a.setAttribute('download', `mes-donnees-${new Date().toISOString().slice(0, 10)}.json`)
            document.body.appendChild(a); a.click(); a.remove()
            window.URL.revokeObjectURL(url)
            flash('success', t('exportSuccess'))
        } catch { flash('error', t('exportError')) }
        finally { setLoading(false) }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm('ATTENTION : Action irréversible. Voulez-vous vraiment supprimer votre compte ?')) return
        if (!window.confirm('Dernière confirmation ?')) return
        setLoading(true)
        try {
            await axios.delete(`${API_URL}/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
            logout()
        } catch (e) { flash('error', e.response?.data?.error || t('deleteError')); setLoading(false) }
    }

    // ── UI helpers ──────────────────────────────────────────
    const Toggle = ({ checked, onChange }) => (
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full
                peer-checked:bg-blue-600 peer-checked:after:translate-x-full
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:border after:border-slate-300 after:rounded-full
                after:h-5 after:w-5 after:transition-all" />
        </label>
    )

    const Input = ({ value, onChange, disabled, placeholder, type = 'text' }) => (
        <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                ${disabled
                    ? 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                }`} />
    )

    const Select = ({ value, onChange, children }) => (
        <select value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {children}
        </select>
    )

    const Btn = ({ onClick, disabled, variant = 'primary', children }) => (
        <button onClick={onClick} disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${variant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
            {children}
        </button>
    )

    const Card = ({ children, cls = '' }) => (
        <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${cls}`}>
            {children}
        </div>
    )
    const Title = ({ children }) => <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">{children}</h2>
    const Field = ({ label, hint, children }) => (
        <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            {children}
            {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
    )

    const tabs = [
        { id: 'profile', label: t('profile'), icon: User },
        { id: 'account', label: t('account'), icon: Shield },
        { id: 'notifications', label: t('notifications'), icon: Bell },
        { id: 'appearance', label: t('appearance'), icon: Palette },
        { id: 'preferences', label: t('preferences'), icon: Cog },
        { id: 'privacy', label: t('privacy'), icon: Lock },
        ...(isChefDept && !isAdmin
            ? [{ id: 'monrole', label: 'Mon Rôle', icon: Crown }]
            : []
        ),
        { id: 'data', label: t('data'), icon: Database },
    ]

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8">

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t('settings')}</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Gérez vos préférences et paramètres de compte</p>
                        </div>

                        {error && (
                            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="mb-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                            </div>
                        )}

                        <div className="flex gap-6">
                            {/* ── Onglets ── */}
                            <div className="w-56 flex-shrink-0">
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-6">
                                    {tabs.map(({ id, label, icon: Icon }) => (
                                        <button key={id}
                                            onClick={() => { setActiveTab(id); setError(''); setSuccess('') }}
                                            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-l-4 text-left
                                                ${activeTab === id
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                }`}>
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="font-medium text-sm">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">

                                {/* ══ PROFIL ══ */}
                                {activeTab === 'profile' && (
                                    <Card>
                                        <Title>{t('profile')}</Title>
                                        <div className="space-y-4">
                                            <Field label={`${t('fullName')} *`}>
                                                <Input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} />
                                            </Field>
                                            <Field label={t('email')} hint={t('emailCantChange')}>
                                                <Input value={profile.email} disabled />
                                            </Field>
                                            <Field label={t('phone')}>
                                                <Input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+213 XXX XXX XXX" />
                                            </Field>
                                            <Field label={t('position')}>
                                                <Input value={profile.position} onChange={e => setProfile({ ...profile, position: e.target.value })} />
                                            </Field>
                                            <Field label={t('department')} hint={t('deptManaged')}>
                                                <Input value={profile.department} disabled />
                                            </Field>
                                            <div className="pt-1">
                                                <Btn onClick={handleSaveProfile} disabled={loading}>
                                                    <Save className="w-4 h-4" />{loading ? t('saving') : t('saveChanges')}
                                                </Btn>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* ══ COMPTE ══ */}
                                {activeTab === 'account' && (
                                    <div className="space-y-5">
                                        <Card>
                                            <Title>{t('changePassword')}</Title>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'current', label: t('currentPassword') },
                                                    { key: 'new', label: t('newPassword') },
                                                    { key: 'confirm', label: t('confirmPassword') },
                                                ].map(({ key, label }) => (
                                                    <div key={key}>
                                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                            <input
                                                                type={showPwd[key] ? 'text' : 'password'}
                                                                value={pwd[key]}
                                                                onChange={e => setPwd({ ...pwd, [key]: e.target.value })}
                                                                className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <button type="button"
                                                                onClick={() => setShowPwd({ ...showPwd, [key]: !showPwd[key] })}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                                {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <p className="text-xs text-slate-400">{t('passwordHint')}</p>
                                                <Btn onClick={handleChangePassword} disabled={loading}>
                                                    <Key className="w-4 h-4" />{loading ? t('changing') : t('changePassword')}
                                                </Btn>
                                            </div>
                                        </Card>
                                        <Card>
                                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">{t('activeSession')}</h2>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Smartphone className="w-5 h-5 text-green-500" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('activeSession')}</p>
                                                        <p className="text-xs text-slate-500">{t('connectedAs')} {user?.full_name}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Active</span>
                                            </div>
                                        </Card>
                                        <Card>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">{t('twoFA')}</h2>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('twoFADesc')}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold rounded-full">{t('comingSoon')}</span>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* ══ NOTIFICATIONS ══ */}
                                {activeTab === 'notifications' && (
                                    <Card>
                                        <Title>{t('notifications')}</Title>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Canaux</p>
                                                <div className="space-y-2">
                                                    {[
                                                        { icon: Mail, color: 'text-blue-500', label: t('emailNotif'), desc: t('emailNotifDesc'), val: emailNotif, set: setEmailNotif },
                                                        { icon: Bell, color: 'text-purple-500', label: t('pushNotif'), desc: t('pushNotifDesc'), val: pushNotif, set: setPushNotif },
                                                        { icon: Radio, color: 'text-green-500', label: t('soundNotif'), desc: t('soundNotifDesc'), val: soundEnabled, set: setSoundEnabled },
                                                    ].map(({ icon: Icon, color, label, desc, val, set }) => (
                                                        <div key={label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <Icon className={`w-4 h-4 ${color}`} />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                                                                </div>
                                                            </div>
                                                            <Toggle checked={val} onChange={set} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('notifTypes')}</p>
                                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {[
                                                        ['tasks', t('notifTasks')],
                                                        ['messages', t('notifMessages')],
                                                        ['posts', t('notifPosts')],
                                                        ['leaves', t('notifLeaves')],
                                                        ['surveys', t('notifSurveys')],
                                                        ['mentions', t('notifMentions')],
                                                    ].map(([key, label]) => (
                                                        <div key={key} className="flex items-center justify-between py-2.5">
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                                                            <Toggle checked={notifPrefs[key] ?? true} onChange={v => setNotifPrefs({ ...notifPrefs, [key]: v })} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <Btn onClick={handleSavePreferences}><Save className="w-4 h-4" />{t('savePreferences')}</Btn>
                                        </div>
                                    </Card>
                                )}

                                {/* ══ APPARENCE ══ */}
                                {activeTab === 'appearance' && (
                                    <Card>
                                        <Title>{t('appearance')}</Title>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('theme')}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { val: false, icon: Sun, label: t('lightMode'), sub: t('lightModeDesc') },
                                                        { val: true, icon: Moon, label: t('darkMode'), sub: t('darkModeDesc') },
                                                    ].map(({ val, icon: Icon, label, sub }) => (
                                                        <button key={label} onClick={() => setDarkMode(val)}
                                                            className={`p-4 rounded-xl border-2 transition-all text-center
                                                                ${darkMode === val
                                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                                }`}>
                                                            <Icon className={`w-6 h-6 mx-auto mb-2 ${darkMode === val ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                                            <p className={`font-semibold text-sm ${darkMode === val ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</p>
                                                            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {darkMode ? t('darkMode') : t('lightMode')} {t('themeActive')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('accentColor')}</p>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                                                        className="w-12 h-12 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-600 p-0.5 bg-transparent" />
                                                    <div>
                                                        <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{accentColor}</p>
                                                        <p className="text-xs text-slate-500">Couleur principale de l'interface</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-8 gap-1.5">
                                                    {['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'].map(c => (
                                                        <button key={c} onClick={() => setAccentColor(c)} title={c}
                                                            className={`h-8 rounded-lg border-2 transition-all ${accentColor === c ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                                            style={{ backgroundColor: c }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <Btn onClick={handleSavePreferences}><Save className="w-4 h-4" />{t('savePreferences')}</Btn>
                                        </div>
                                    </Card>
                                )}

                                {/* ══ PRÉFÉRENCES ══ */}
                                {activeTab === 'preferences' && (
                                    <Card>
                                        <Title>{t('preferences')}</Title>
                                        <div className="space-y-4">
                                            <Field label={t('language')}>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <Select value={language} onChange={setLanguage}>
                                                        <option value="fr">🇫🇷 Français</option>
                                                        <option value="en">🇬🇧 English</option>
                                                        <option value="ar">🇩🇿 العربية</option>
                                                        <option value="es">🇪🇸 Español</option>
                                                    </Select>
                                                </div>
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Langue appliquée immédiatement dans toute l'app
                                                </p>
                                            </Field>
                                            <Field label={t('timezone')}>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <Select value={timezone} onChange={setTimezone}>
                                                        <option value="Africa/Algiers">Algiers (GMT+1)</option>
                                                        <option value="Europe/Paris">Paris (GMT+1)</option>
                                                        <option value="Europe/London">London (GMT+0)</option>
                                                        <option value="America/New_York">New York (GMT-5)</option>
                                                        <option value="Asia/Dubai">Dubai (GMT+4)</option>
                                                    </Select>
                                                </div>
                                            </Field>
                                            <Field label={t('dateFormat')}>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <Select value={dateFormat} onChange={setDateFormat}>
                                                        <option value="DD/MM/YYYY">DD/MM/YYYY — ex: 04/04/2026</option>
                                                        <option value="MM/DD/YYYY">MM/DD/YYYY — ex: 04/04/2026</option>
                                                        <option value="YYYY-MM-DD">YYYY-MM-DD — ex: 2026-04-04</option>
                                                    </Select>
                                                </div>
                                            </Field>
                                            <div className="pt-1">
                                                <Btn onClick={handleSavePreferences}><Save className="w-4 h-4" />{t('savePreferences')}</Btn>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* ══ CONFIDENTIALITÉ ══ */}
                                {activeTab === 'privacy' && (
                                    <div className="space-y-5">
                                        <Card>
                                            <Title>{t('privacy')}</Title>
                                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {[
                                                    { label: t('publicProfile'), desc: t('publicProfileDesc') },
                                                    { label: t('onlineStatus'), desc: t('onlineStatusDesc') },
                                                    { label: t('analytics2'), desc: t('analyticsDesc') },
                                                ].map(({ label, desc }) => (
                                                    <div key={label} className="flex items-center justify-between py-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                                                        </div>
                                                        <Toggle checked={true} onChange={() => { }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-0.5">{t('dataProtected')}</p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300">{t('dataProtectedDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ══ MON RÔLE — chef de département uniquement ══ */}
                                {activeTab === 'monrole' && isChefDept && !isAdmin && (
                                    <div className="space-y-5">
                                        {/* Carte info rôle */}
                                        <Card>
                                            <Title>Mon Rôle</Title>
                                            <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl mb-6">
                                                <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Crown className="w-6 h-6 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Chef de Département</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {user?.department || 'Département non défini'}
                                                    </p>
                                                </div>
                                                <span className="ml-auto px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                                                    ACTIF
                                                </span>
                                            </div>

                                            {/* Switch mode */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Interface active
                                                </p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Mode Employé */}
                                                    <button
                                                        onClick={() => { if (userMode !== 'employee') handleSwitchMode() }}
                                                        className={`p-4 rounded-xl border-2 transition-all text-center ${userMode === 'employee'
                                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <User className={`w-6 h-6 mx-auto mb-2 ${userMode === 'employee' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                                            }`} />
                                                        <p className={`font-semibold text-sm ${userMode === 'employee' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                                                            }`}>Mode Employé</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">Tâches, congés, messages</p>
                                                        {userMode === 'employee' && (
                                                            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                                                                ACTIF
                                                            </span>
                                                        )}
                                                    </button>

                                                    {/* Mode Chef */}
                                                    <button
                                                        onClick={() => { if (userMode !== 'chef') handleSwitchMode() }}
                                                        className={`p-4 rounded-xl border-2 transition-all text-center ${userMode === 'chef'
                                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <Crown className={`w-6 h-6 mx-auto mb-2 ${userMode === 'chef' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                                                            }`} />
                                                        <p className={`font-semibold text-sm ${userMode === 'chef' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'
                                                            }`}>Mode Chef</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">Gestion équipe, analytics</p>
                                                        {userMode === 'chef' && (
                                                            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                                                                ACTIF
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                                                    <ArrowLeftRight className="w-3 h-3" />
                                                    Le switch est aussi disponible dans la barre du haut
                                                </p>
                                            </div>
                                        </Card>

                                        {/* Permissions */}
                                        <Card>
                                            <Title>Mes permissions</Title>
                                            <div className="space-y-1">
                                                {[
                                                    { label: "Voir les tâches de l'équipe", ok: true },
                                                    { label: "Gérer les congés de l'équipe", ok: true },
                                                    { label: "Accéder aux feedbacks de l'équipe", ok: true },
                                                    { label: "Voir les analytics du département", ok: true },
                                                    { label: "Gérer les utilisateurs", ok: false },
                                                    { label: "Accès administration globale", ok: false },
                                                ].map(({ label, ok }) => (
                                                    <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        {ok
                                                            ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                            : <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                                        }
                                                        <span className={`text-sm ${ok ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* ══ DONNÉES ══ */}
                                {activeTab === 'data' && (
                                    <div className="space-y-5">
                                        <Card>
                                            <Title>{t('exportData')}</Title>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('exportDesc')}</p>
                                            <Btn variant="secondary" onClick={handleExportData} disabled={loading}>
                                                <Download className="w-4 h-4" />{loading ? t('exporting') : t('exportBtn')}
                                            </Btn>
                                        </Card>
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                                            <h2 className="text-base font-bold text-red-800 dark:text-red-200 mb-1">{t('dangerZone')}</h2>
                                            <p className="text-sm text-red-600 dark:text-red-300 mb-4">{t('deleteDesc')}</p>
                                            <button onClick={handleDeleteAccount} disabled={loading}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition-colors">
                                                <Trash2 className="w-4 h-4" />{t('deleteAccount')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}