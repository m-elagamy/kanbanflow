export const BOARDS_LIST_LIMIT = 12;

export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const;

export const CTA_CONFIG = {
  PRIMARY: {
    href: AUTH_ROUTES.SIGN_UP,
    label: "Get Started",
    description: "Start organizing your tasks today",
  },
  SECONDARY: {
    href: AUTH_ROUTES.SIGN_IN,
    label: "Sign In",
    description: "Welcome back",
  },
  CTA_SECTION: {
    href: AUTH_ROUTES.SIGN_UP,
    label: "Start for free",
    description: "Experience the power of KanbanFlow",
  },
} as const;