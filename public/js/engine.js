// Función para aplicar la identidad visual del colegio
export const aplicarBranding = (config) => {
    if (config.color_primario) {
        document.documentElement.style.setProperty('--primary', config.color_primario);
    }
    const logoImg = document.getElementById('logo-organizacion');
    if (logoImg) logoImg.src = config.logo_url;
};