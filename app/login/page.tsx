import { redirect } from 'next/navigation';

export default function LoginRedirect() {
  // Rediriger vers la version française par défaut
  redirect('/fr/login');
}
