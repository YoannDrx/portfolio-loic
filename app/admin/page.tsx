import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  // Rediriger vers la version française par défaut
  redirect('/fr/admin');
}
