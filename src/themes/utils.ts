export const themeNames: string[] = ['default', 'dark', 'green'];
export const DEFAULT_THEME: string = themeNames[0];

export const applyTheme = (theme: string): void => {
    const currentClass = document.body.classList;
    themeNames.forEach(name => {
        currentClass.remove(name);
    });

    currentClass.add(theme)
};
