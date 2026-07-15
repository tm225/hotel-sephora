// ============================================================
// Sephora Hotel — Connexion Supabase
// Clé "anon/public" : conçue pour être utilisée côté client,
// elle n'autorise que ce que les règles RLS permettent
// (lecture des chambres/équipements, création de réservations).
// ============================================================

const SUPABASE_URL = "https://ifgblmhxxytafbanzwxv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2JsbWh4eHl0YWZiYW56d3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjUyMTMsImV4cCI6MjA5OTY0MTIxM30.P_bCtLB6Ta18OG9Cug3bWO9VwKT8aOxBZLjVBIQS5Ds";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------------------- Chambres --------------------

async function getChambres() {
  const { data, error } = await supabaseClient
    .from("chambres")
    .select("*")
    .order("ordre", { ascending: true });

  if (error) {
    console.error("Erreur chargement chambres :", error);
    return [];
  }
  return data;
}

// -------------------- Équipements --------------------

async function getEquipements() {
  const { data, error } = await supabaseClient
    .from("equipements")
    .select("*")
    .order("ordre", { ascending: true });

  if (error) {
    console.error("Erreur chargement équipements :", error);
    return [];
  }
  return data;
}

// -------------------- Réservations --------------------

async function creerReservation(reservation) {
  const { data, error } = await supabaseClient
    .from("reservations")
    .insert([reservation])
    .select();

  if (error) {
    console.error("Erreur création réservation :", error);
    return { success: false, error };
  }
  return { success: true, data };
}

// ============================================================
// Ce qui suit n'est utilisé que par admin.html (espace hôtelier).
// Ces fonctions nécessitent d'être connecté : les règles de
// sécurité (RLS) les bloquent pour un visiteur non authentifié.
// ============================================================

// -------------------- Connexion admin --------------------

async function connexionAdmin(email, motDePasse) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: motDePasse,
  });
  if (error) return { success: false, error };
  return { success: true, data };
}

async function demanderResetMotDePasse(email, urlRedirection) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: urlRedirection,
  });
  return { success: !error, error };
}

async function mettreAJourMotDePasse(nouveauMotDePasse) {
  const { error } = await supabaseClient.auth.updateUser({ password: nouveauMotDePasse });
  return { success: !error, error };
}

async function deconnexionAdmin() {
  await supabaseClient.auth.signOut();
}

async function sessionAdmin() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

// -------------------- Réservations (admin) --------------------

async function getToutesReservations() {
  const { data, error } = await supabaseClient
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur chargement réservations :", error);
    return [];
  }
  return data;
}

async function majStatutReservation(id, statut) {
  const { error } = await supabaseClient
    .from("reservations")
    .update({ statut })
    .eq("id", id);

  return { success: !error, error };
}

// -------------------- Chambres (admin) --------------------

async function majChambre(id, champs) {
  const { error } = await supabaseClient
    .from("chambres")
    .update(champs)
    .eq("id", id);

  return { success: !error, error };
}

async function uploaderPhotoChambre(fichier, chambreId) {
  const extension = fichier.name.split('.').pop();
  const chemin = `${chambreId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabaseClient
    .storage
    .from("chambres-photos")
    .upload(chemin, fichier, { upsert: true });

  if (uploadError) return { success: false, error: uploadError };

  const { data } = supabaseClient
    .storage
    .from("chambres-photos")
    .getPublicUrl(chemin);

  return { success: true, url: data.publicUrl };
}
