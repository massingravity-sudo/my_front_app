// src/context/LanguageContext.jsx
// Système i18n léger — pas de dépendance externe
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    fr: {
        // Navigation
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

        // Paramètres
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

        // Messages
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
        notifPosts: 'New news',
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
        exportDesc: 'Download a full copy of your personal data (GDPR)',
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

        emailNotif: 'إشعارات البريد الإلكتروني',
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

        emailNotif: 'Notificaciones por Email',
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
    },
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(
        () => localStorage.getItem('language') || 'fr'
    );

    // t('key') → traduit la clé dans la langue active
    const t = (key) => translations[language]?.[key] ?? translations['fr'][key] ?? key;

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        // RTL pour l'arabe
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    };

    // Appliquer dir/lang au chargement
    useEffect(() => {
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};