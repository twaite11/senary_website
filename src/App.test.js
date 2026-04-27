import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

test('renders Senary landing after intro', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>,
  );
  await waitFor(
    () => {
      expect(screen.getByText(/SENARY BIO/i)).toBeInTheDocument();
    },
    { timeout: 5000 },
  );
});
