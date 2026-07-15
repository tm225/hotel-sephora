-- ============================================================
-- Sephora Hotel — Schéma Supabase
-- À exécuter dans Supabase > SQL Editor > New query > Run
-- ============================================================

-- Table des chambres
create table if not exists chambres (
  id uuid primary key default gen_random_uuid(),
  ordre int not null default 0,
  nom text not null,
  sous_titre text,
  description text,
  prix numeric,
  image text,
  equipements text[] default '{}',
  disponible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Table des équipements de l'hôtel
create table if not exists equipements (
  id uuid primary key default gen_random_uuid(),
  ordre int not null default 0,
  icone text,
  titre text not null,
  description text,
  created_at timestamptz not null default now()
);

-- Table des réservations (formulaire de contact)
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text not null,
  email text,
  chambre text,
  date_arrivee date,
  date_depart date,
  message text,
  statut text not null default 'nouvelle', -- nouvelle | confirmee | annulee
  created_at timestamptz not null default now()
);

-- ============================================================
-- Sécurité (RLS) : le site est public, donc on autorise
-- - la LECTURE publique de chambres et equipements
-- - l'ÉCRITURE publique de reservations (formulaire de contact)
-- - pas de lecture publique des réservations (données clients)
-- ============================================================

alter table chambres enable row level security;
alter table equipements enable row level security;
alter table reservations enable row level security;

create policy "Lecture publique des chambres"
  on chambres for select
  using (true);

create policy "Lecture publique des équipements"
  on equipements for select
  using (true);

create policy "Création publique de réservations"
  on reservations for insert
  with check (true);

-- ============================================================
-- Données de départ : on reprend le contenu actuel du site
-- pour que rien ne change visuellement après la migration.
-- ============================================================

insert into chambres (ordre, nom, sous_titre, description, image, equipements) values
(1, 'Chambre Teck', 'Lignes épurées, bois massif',
 'Une tête de lit en teck massif, une literie d''un blanc impeccable et une lumière douce : la chambre Teck mise sur la sobriété pour un repos sans distraction.',
 'assets/room-bed-teak.jpg',
 array['Lit double','Climatisation','Salle d''eau privative','Bureau']),
(2, 'Chambre Émeraude', 'Une touche de couleur vive',
 'Couvre-lit vert éclatant, miroir en forme de soleil et coin bureau : cette chambre apporte du peps sans jamais sacrifier le confort d''un lit large et bien préparé.',
 'assets/room-green-bed.jpg',
 array['Lit king size','Miroir déco','Coin bureau','Climatisation']),
(3, 'Chambre Confort', 'Pensée pour les séjours studieux',
 'Bureau avec chaise, télévision murale et grande fenêtre : la chambre Confort s''adresse aux voyageurs qui ont besoin de travailler ou de se poser quelques jours.',
 'assets/bathroom.jpg',
 array['Bureau & chaise','Télévision murale','Climatisation','Grande fenêtre']),
(4, 'Dans chaque chambre', 'Des rangements sur mesure',
 'Grande armoire à portes persiennes en bois massif : de quoi déballer vos valises et vous installer, même pour un séjour prolongé.',
 'assets/room-wardrobe.jpg',
 array['Grande armoire','Porte-serviettes','Sol carrelé']);

insert into equipements (ordre, icone, titre, description) values
(1, '🕑', 'Réception 24h/24', 'Une équipe présente à toute heure pour votre arrivée, un renseignement ou une urgence.'),
(2, '❄️', 'Climatisation', 'Chaque chambre est équipée d''un climatiseur individuel réglable.'),
(3, '📶', 'Wifi gratuit', 'Connexion disponible dans les chambres et les espaces communs.'),
(4, '🚗', 'Parking sécurisé', 'Une cour fermée pour garer votre véhicule en toute tranquillité.'),
(5, '📺', 'Télévision', 'Un téléviseur mural dans chaque chambre et dans les salons.'),
(6, '🌿', 'Jardin & terrasse', 'Un extérieur verdoyant pour prendre l''air entre deux visites.'),
(7, '🪟', 'Chambres lumineuses', 'Grandes fenêtres et rideaux occultants pour bien dormir, à toute heure.'),
(8, '🧺', 'Linge fourni', 'Draps et serviettes changés régulièrement pour un confort constant.'),
(9, '🧳', 'Rangements généreux', 'Grandes armoires en bois massif pour poser vos affaires durablement.');
