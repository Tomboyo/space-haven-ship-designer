export const rem = () => parseInt(window.getComputedStyle(document.documentElement).fontSize)

export const styleButtonActive = (button) => button.classList.add('active');

export const styleButtonInactive = (button) => button.classList.remove('active');
