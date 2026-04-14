// src/context/AppContext.jsx
// Context global pour dark mode + langue (i18n léger sans dépendance externe)
// Utilisé par : Parametre.jsx, Dashboard.jsx, Topbar.jsx,
//               Messages.jsx, Posts.jsx, Surveys.jsx, Feedbacks.jsx, Analytics.jsx
//               et tout composant qui a besoin de useApp()

import { createContext, useContext, useState, useEffect } from 'react';

// ── Traductions ──────────────────────────────────────────────────────────────
const translations = {
    fr: {
        // Sidebar
        dashboard: 'Tableau de bord',
        tasks: 'Gestion des Tâches',
        posts: 'Communications Internes',
        messages: 'Messagerie',
        archives: 'Archives & Documents',
        surveys: 'Enquêtes Internes',
        feedbacks: 'Boîte à idées',
        leaves: 'Gestion des Congés',
        analytics: 'Analyse IA',
        settings: 'Paramètres',
        logout: 'Déconnexion',
        // Onglets paramètres
        profile: 'Profil',
        account: 'Compte & Sécurité',
        notifications: 'Notifications',
        appearance: 'Apparence',
        preferences: 'Préférences',
        privacy: 'Confidentialité',
        data: 'Données',
        // Profil
        fullName: 'Nom Complet',
        email: 'Email Professionnel',
        phone: 'Téléphone',
        position: 'Poste',
        department: 'Département',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        emailCantChange: "L'email ne peut pas être modifié",
        deptManaged: "Le département est géré par l'administrateur",
        // Mot de passe
        currentPassword: 'Mot de Passe Actuel',
        newPassword: 'Nouveau Mot de Passe',
        confirmPassword: 'Confirmer le Nouveau Mot de Passe',
        changePassword: 'Changer le mot de passe',
        changing: 'Modification...',
        passwordHint: 'Minimum 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux',
        // Notifications
        emailNotif: 'Notifications Email',
        pushNotif: 'Notifications Push',
        soundNotif: 'Sons',
        emailNotifDesc: 'Emails pour les événements importants',
        pushNotifDesc: 'Notifications dans le navigateur',
        soundNotifDesc: 'Son lors de nouvelles notifications',
        savePreferences: 'Enregistrer les préférences',
        notifTypes: "Types d'événements",
        notifTasks: 'Nouvelles tâches assignées',
        notifMessages: 'Nouveaux messages',
        notifPosts: 'Nouvelles actualités',
        notifLeaves: 'Demandes de congés',
        notifSurveys: 'Nouvelles enquêtes',
        notifMentions: 'Mentions et réponses',
        // Apparence
        theme: 'Thème',
        lightMode: 'Mode Clair',
        darkMode: 'Mode Sombre',
        lightModeDesc: 'Interface lumineuse',
        darkModeDesc: 'Réduit la fatigue oculaire',
        accentColor: "Couleur d'Accentuation",
        themeActive: 'actif — sauvegardé automatiquement',
        // Préférences
        language: "Langue de l'Interface",
        timezone: 'Fuseau Horaire',
        dateFormat: 'Format de Date',
        // Données
        exportData: 'Export de Vos Données',
        exportDesc: 'Téléchargez une copie complète de vos données personnelles (RGPD)',
        exportBtn: 'Exporter mes données',
        exporting: 'Export en cours...',
        dangerZone: 'Zone Dangereuse',
        deleteDesc: 'La suppression est irréversible. Toutes vos données seront définitivement supprimées.',
        deleteAccount: 'Supprimer mon compte',
        // Messages retour
        profileUpdated: 'Profil mis à jour avec succès ✓',
        passwordChanged: 'Mot de passe modifié avec succès ✓',
        prefsSaved: 'Préférences enregistrées ✓',
        exportSuccess: 'Données exportées avec succès ✓',
        nameRequired: 'Le nom complet est obligatoire',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
        enterCurrentPwd: 'Veuillez entrer votre mot de passe actuel',
        exportError: "Erreur lors de l'export des données",
        deleteError: 'Erreur lors de la suppression du compte',
        // Compte
        activeSession: 'Session actuelle',
        connectedAs: 'Connecté en tant que',
        twoFA: 'Authentification 2FA',
        twoFADesc: 'Sécurité supplémentaire pour votre compte',
        comingSoon: 'Bientôt disponible',
        // Confidentialité
        dataProtected: 'Vos données sont protégées',
        dataProtectedDesc: 'Chiffrement AES-256. Conformité RGPD garantie.',
        publicProfile: 'Profil Public',
        publicProfileDesc: 'Les autres employés peuvent voir votre profil',
        onlineStatus: 'Statut En Ligne',
        onlineStatusDesc: 'Afficher quand vous êtes connecté',
        analytics2: 'Collecte Analytics',
        analyticsDesc: "Aider à améliorer l'application",
    },

    en: {
        dashboard: 'Dashboard',
        tasks: 'Task Management',
        posts: 'Internal Communications',
        messages: 'Messaging',
        archives: 'Archives & Documents',
        surveys: 'Internal Surveys',
        feedbacks: 'Ideas Box',
        leaves: 'Leave Management',
        analytics: 'AI Analytics',
        settings: 'Settings',
        logout: 'Logout',
        profile: 'Profile',
        account: 'Account & Security',
        notifications: 'Notifications',
        appearance: 'Appearance',
        preferences: 'Preferences',
        privacy: 'Privacy',
        data: 'Data',
        fullName: 'Full Name',
        email: 'Professional Email',
        phone: 'Phone',
        position: 'Position',
        department: 'Department',
        saveChanges: 'Save changes',
        saving: 'Saving...',
        emailCantChange: 'Email cannot be changed',
        deptManaged: 'Department is managed by the administrator',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        changePassword: 'Change password',
        changing: 'Changing...',
        passwordHint: 'Minimum 8 characters with uppercase, lowercase, numbers and special characters',
        emailNotif: 'Email Notifications',
        pushNotif: 'Push Notifications',
        soundNotif: 'Sounds',
        emailNotifDesc: 'Emails for important events',
        pushNotifDesc: 'Browser notifications',
        soundNotifDesc: 'Sound on new notifications',
        savePreferences: 'Save preferences',
        notifTypes: 'Event types',
        notifTasks: 'New assigned tasks',
        notifMessages: 'New messages',
        notifPosts: 'New posts',
        notifLeaves: 'Leave requests',
        notifSurveys: 'New surveys',
        notifMentions: 'Mentions and replies',
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        lightModeDesc: 'Bright interface',
        darkModeDesc: 'Reduces eye strain',
        accentColor: 'Accent Color',
        themeActive: 'active — saved automatically',
        language: 'Interface Language',
        timezone: 'Time Zone',
        dateFormat: 'Date Format',
        exportData: 'Export Your Data',
        exportDesc: 'Download a complete copy of your personal data (GDPR)',
        exportBtn: 'Export my data',
        exporting: 'Exporting...',
        dangerZone: 'Danger Zone',
        deleteDesc: 'Deletion is irreversible. All your data will be permanently deleted.',
        deleteAccount: 'Delete my account',
        profileUpdated: 'Profile updated successfully ✓',
        passwordChanged: 'Password changed successfully ✓',
        prefsSaved: 'Preferences saved ✓',
        exportSuccess: 'Data exported successfully ✓',
        nameRequired: 'Full name is required',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 8 characters',
        enterCurrentPwd: 'Please enter your current password',
        exportError: 'Error exporting data',
        deleteError: 'Error deleting account',
        activeSession: 'Current session',
        connectedAs: 'Connected as',
        twoFA: '2FA Authentication',
        twoFADesc: 'Extra security for your account',
        comingSoon: 'Coming soon',
        dataProtected: 'Your data is protected',
        dataProtectedDesc: 'AES-256 encryption. GDPR compliant.',
        publicProfile: 'Public Profile',
        publicProfileDesc: 'Other employees can see your profile',
        onlineStatus: 'Online Status',
        onlineStatusDesc: 'Show when you are connected',
        analytics2: 'Analytics Collection',
        analyticsDesc: 'Help improve the application',
    },

    ar: {
        dashboard: 'لوحة التحكم',
        tasks: 'إدارة المهام',
        posts: 'التواصل الداخلي',
        messages: 'المراسلة',
        archives: 'الأرشيف والوثائق',
        surveys: 'الاستطلاعات الداخلية',
        feedbacks: 'صندوق الأفكار',
        leaves: 'إدارة الإجازات',
        analytics: 'تحليل الذكاء الاصطناعي',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        profile: 'الملف الشخصي',
        account: 'الحساب والأمان',
        notifications: 'الإشعارات',
        appearance: 'المظهر',
        preferences: 'التفضيلات',
        privacy: 'الخصوصية',
        data: 'البيانات',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني المهني',
        phone: 'الهاتف',
        position: 'المنصب',
        department: 'القسم',
        saveChanges: 'حفظ التغييرات',
        saving: 'جارٍ الحفظ...',
        emailCantChange: 'لا يمكن تغيير البريد الإلكتروني',
        deptManaged: 'يدار القسم من قبل المسؤول',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور الجديدة',
        changePassword: 'تغيير كلمة المرور',
        changing: 'جارٍ التغيير...',
        passwordHint: 'الحد الأدنى 8 أحرف مع أحرف كبيرة وصغيرة وأرقام ورموز',
        emailNotif: 'إشعارات البريد',
        pushNotif: 'الإشعارات الفورية',
        soundNotif: 'الأصوات',
        emailNotifDesc: 'رسائل للأحداث المهمة',
        pushNotifDesc: 'إشعارات المتصفح',
        soundNotifDesc: 'صوت عند الإشعارات الجديدة',
        savePreferences: 'حفظ التفضيلات',
        notifTypes: 'أنواع الأحداث',
        notifTasks: 'مهام جديدة مخصصة',
        notifMessages: 'رسائل جديدة',
        notifPosts: 'أخبار جديدة',
        notifLeaves: 'طلبات الإجازة',
        notifSurveys: 'استطلاعات جديدة',
        notifMentions: 'الإشارات والردود',
        theme: 'المظهر',
        lightMode: 'الوضع الفاتح',
        darkMode: 'الوضع الداكن',
        lightModeDesc: 'واجهة مضيئة',
        darkModeDesc: 'يقلل إجهاد العين',
        accentColor: 'لون التمييز',
        themeActive: 'نشط — محفوظ تلقائياً',
        language: 'لغة الواجهة',
        timezone: 'المنطقة الزمنية',
        dateFormat: 'تنسيق التاريخ',
        exportData: 'تصدير بياناتك',
        exportDesc: 'تنزيل نسخة كاملة من بياناتك الشخصية',
        exportBtn: 'تصدير بياناتي',
        exporting: 'جارٍ التصدير...',
        dangerZone: 'المنطقة الخطرة',
        deleteDesc: 'الحذف لا رجعة فيه. ستُحذف جميع بياناتك نهائياً.',
        deleteAccount: 'حذف حسابي',
        profileUpdated: 'تم تحديث الملف الشخصي ✓',
        passwordChanged: 'تم تغيير كلمة المرور ✓',
        prefsSaved: 'تم حفظ التفضيلات ✓',
        exportSuccess: 'تم تصدير البيانات ✓',
        nameRequired: 'الاسم الكامل مطلوب',
        passwordMismatch: 'كلمتا المرور غير متطابقتين',
        passwordTooShort: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل',
        enterCurrentPwd: 'الرجاء إدخال كلمة مرورك الحالية',
        exportError: 'خطأ في تصدير البيانات',
        deleteError: 'خطأ في حذف الحساب',
        activeSession: 'الجلسة الحالية',
        connectedAs: 'متصل بصفة',
        twoFA: 'المصادقة الثنائية',
        twoFADesc: 'أمان إضافي لحسابك',
        comingSoon: 'قريباً',
        dataProtected: 'بياناتك محمية',
        dataProtectedDesc: 'تشفير AES-256. متوافق مع RGPD.',
        publicProfile: 'الملف العام',
        publicProfileDesc: 'يمكن للموظفين الآخرين رؤية ملفك',
        onlineStatus: 'حالة الاتصال',
        onlineStatusDesc: 'إظهار متى تكون متصلاً',
        analytics2: 'جمع البيانات التحليلية',
        analyticsDesc: 'المساعدة في تحسين التطبيق',
    },

    es: {
        dashboard: 'Panel de control',
        tasks: 'Gestión de Tareas',
        posts: 'Comunicaciones Internas',
        messages: 'Mensajería',
        archives: 'Archivos y Documentos',
        surveys: 'Encuestas Internas',
        feedbacks: 'Buzón de Ideas',
        leaves: 'Gestión de Permisos',
        analytics: 'Análisis IA',
        settings: 'Configuración',
        logout: 'Cerrar sesión',
        profile: 'Perfil',
        account: 'Cuenta y Seguridad',
        notifications: 'Notificaciones',
        appearance: 'Apariencia',
        preferences: 'Preferencias',
        privacy: 'Privacidad',
        data: 'Datos',
        fullName: 'Nombre Completo',
        email: 'Email Profesional',
        phone: 'Teléfono',
        position: 'Cargo',
        department: 'Departamento',
        saveChanges: 'Guardar cambios',
        saving: 'Guardando...',
        emailCantChange: 'El email no puede modificarse',
        deptManaged: 'El departamento es gestionado por el administrador',
        currentPassword: 'Contraseña Actual',
        newPassword: 'Nueva Contraseña',
        confirmPassword: 'Confirmar Nueva Contraseña',
        changePassword: 'Cambiar contraseña',
        changing: 'Cambiando...',
        passwordHint: 'Mínimo 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales',
        emailNotif: 'Notificaciones Email',
        pushNotif: 'Notificaciones Push',
        soundNotif: 'Sonidos',
        emailNotifDesc: 'Emails para eventos importantes',
        pushNotifDesc: 'Notificaciones del navegador',
        soundNotifDesc: 'Sonido en nuevas notificaciones',
        savePreferences: 'Guardar preferencias',
        notifTypes: 'Tipos de eventos',
        notifTasks: 'Nuevas tareas asignadas',
        notifMessages: 'Nuevos mensajes',
        notifPosts: 'Nuevas noticias',
        notifLeaves: 'Solicitudes de permiso',
        notifSurveys: 'Nuevas encuestas',
        notifMentions: 'Menciones y respuestas',
        theme: 'Tema',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',
        lightModeDesc: 'Interfaz luminosa',
        darkModeDesc: 'Reduce la fatiga visual',
        accentColor: 'Color de Acento',
        themeActive: 'activo — guardado automáticamente',
        language: 'Idioma de la Interfaz',
        timezone: 'Zona Horaria',
        dateFormat: 'Formato de Fecha',
        exportData: 'Exportar Tus Datos',
        exportDesc: 'Descarga una copia completa de tus datos personales (RGPD)',
        exportBtn: 'Exportar mis datos',
        exporting: 'Exportando...',
        dangerZone: 'Zona Peligrosa',
        deleteDesc: 'La eliminación es irreversible. Todos tus datos serán eliminados permanentemente.',
        deleteAccount: 'Eliminar mi cuenta',
        profileUpdated: 'Perfil actualizado con éxito ✓',
        passwordChanged: 'Contraseña cambiada con éxito ✓',
        prefsSaved: 'Preferencias guardadas ✓',
        exportSuccess: 'Datos exportados con éxito ✓',
        nameRequired: 'El nombre completo es obligatorio',
        passwordMismatch: 'Las contraseñas no coinciden',
        passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
        enterCurrentPwd: 'Por favor introduce tu contraseña actual',
        exportError: 'Error al exportar los datos',
        deleteError: 'Error al eliminar la cuenta',
        activeSession: 'Sesión actual',
        connectedAs: 'Conectado como',
        twoFA: 'Autenticación 2FA',
        twoFADesc: 'Seguridad adicional para tu cuenta',
        comingSoon: 'Próximamente',
        dataProtected: 'Tus datos están protegidos',
        dataProtectedDesc: 'Cifrado AES-256. Cumplimiento RGPD.',
        publicProfile: 'Perfil Público',
        publicProfileDesc: 'Otros empleados pueden ver tu perfil',
        onlineStatus: 'Estado En Línea',
        onlineStatusDesc: 'Mostrar cuando estás conectado',
        analytics2: 'Recogida de datos analíticos',
        analyticsDesc: 'Ayudar a mejorar la aplicación',
    },
};

// ── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

    // ── Dark mode ─────────────────────────────────────────────
    const [darkMode, setDarkModeState] = useState(
        () => localStorage.getItem('darkMode') === 'true'
    );

    // setDarkMode : applique la classe 'dark' sur <html> ET met à jour le state
    // La classe sur <html> est ce qui active les classes Tailwind dark:xxx
    // et les règles CSS html.dark { ... } dans index.css
    const setDarkMode = (val) => {
        setDarkModeState(val);
        localStorage.setItem('darkMode', String(val));
        if (val) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // ── Langue ────────────────────────────────────────────────
    const [language, setLanguageState] = useState(
        () => localStorage.getItem('language') || 'fr'
    );

    // setLanguage : met à jour le state + localStorage + attributs HTML
    // L'attribut dir='rtl' est nécessaire pour l'arabe
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    };

    // ── Fonction de traduction ────────────────────────────────
    // t('key') → retourne la traduction dans la langue active
    // Fallback sur le français si la clé n'existe pas dans la langue choisie
    const t = (key) =>
        translations[language]?.[key] ?? translations['fr']?.[key] ?? key;

    // ── Synchroniser au montage ───────────────────────────────
    // main.jsx applique déjà les classes avant React, mais ce useEffect
    // garantit la cohérence si AppProvider est remonté (ex: hot reload)
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AppContext.Provider value={{ darkMode, setDarkMode, language, setLanguage, t }}>
            {children}
        </AppContext.Provider>
    );
};