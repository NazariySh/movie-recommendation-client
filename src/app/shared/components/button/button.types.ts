export enum ButtonType {
  Basic = 'basic',
  Flat = 'flat',
  Raised = 'raised',
  Stroked = 'stroked',
  Icon = 'icon',
  Fab = 'fab',
  MiniFab = 'mini-fab',
}

export enum ButtonColor {
  Primary = 'primary',
  Accent = 'accent',
  Warn = 'warn',
  None = '',
}

export enum ButtonSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  Full = 'full',
}

export type ButtonTypeInput = `${ButtonType}`;
export type ButtonColorInput = `${ButtonColor}`;
export type ButtonSizeInput = `${ButtonSize}`;
