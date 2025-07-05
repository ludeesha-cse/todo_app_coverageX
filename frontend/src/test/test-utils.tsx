import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createContext } from "react";
import type { ReactNode } from "react";

// Create a mock auth context for testing
interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock the auth context for testing
const MockAuthProvider = ({
  children,
  value = {},
}: {
  children: ReactNode;
  value?: Partial<AuthContextType>;
}) => {
  const defaultValue: AuthContextType = {
    user: null,
    isLoading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    ...value,
  };

  return (
    <MockAuthContext.Provider value={defaultValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

const AllTheProviders = ({
  children,
  authValue,
}: {
  children: ReactNode;
  authValue?: any;
}) => {
  return (
    <BrowserRouter>
      <MockAuthProvider value={authValue}>{children}</MockAuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { authValue?: any }
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authValue={options?.authValue}>
        {children}
      </AllTheProviders>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };
