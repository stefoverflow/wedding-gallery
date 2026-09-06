# Darko & Andrijana: Galerija sa venčanja

Full-stack aplikacija (React + Node/Express) na kojoj gosti mogu da otpremaju fotografije sa venčanja, a admin može da se prijavi i obriše neželjene fotografije.

Dizajn prati stil vaše pozivnice: kremasta pozadina, tanka zlatna linija, rukopisni font za imena ("Darko & Andrijana") i elegantan serif font za ostatak teksta.

## Struktura projekta

```
wedding-gallery/
├── backend/     Node.js + Express API (upload, lista, brisanje, admin login)
└── frontend/    React (Vite) aplikacija
```

## 1. Pokretanje backend-a

```bash
cd backend
npm install
cp .env.example .env
```

Otvorite `.env` i po želji izmenite:
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: podrazumevano `admin` / `andrijanadarko357`
- `JWT_SECRET`: promenite u dugačak nasumičan string pre nego što app postavite javno
- `CORS_ORIGIN`: adresa na kojoj će raditi frontend (npr. vaš domen)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: sa [dashboard.cloudinary.com](https://cloudinary.com) (besplatan nalog)
- `CLOUDINARY_FOLDER`: folder u Cloudinary-ju gde se čuvaju fotografije (podrazumevano `wedding-gallery-test`)

Pokretanje:

```bash
npm start
```

Server radi na `http://localhost:4000`. Fotografije se čuvaju na Cloudinary-ju (folder podešen preko `CLOUDINARY_FOLDER`); spisak fotografija i njihovi podaci (ime gosta, vreme otpremanja) se čitaju direktno sa Cloudinary-ja, nema lokalne baze ni foldera za čuvanje.

## 2. Pokretanje frontend-a

```bash
cd frontend
npm install
npm run dev
```

Aplikacija se otvara na `http://localhost:5173` i automatski prosleđuje API pozive ka backend-u (podešeno u `vite.config.js`).

Za produkciju:

```bash
npm run build
```

Ovo pravi `frontend/dist` folder koji možete postaviti na bilo koji static hosting (Vercel, Netlify, itd). Pre build-a podesite `VITE_API_URL` u `.env` fajlu (na osnovu `.env.example`) da pokazuje na adresu vašeg backend-a kada front i back nisu na istom domenu.

## Funkcionalnosti

- **Otpremanje fotografija**: drag & drop ili klik, više fotografija odjednom, opciono ime gosta, validacija tipa fajla (JPG/PNG/WEBP/HEIC) i veličine (do 10MB, Cloudinary-jevo ograničenje za jednu fotografiju) i na frontendu i na backendu.
- **Galerija**: najnovije fotografije su prve, responzivan grid (2 kolone na mobilnom, do 4 na desktopu).
- **Fullscreen pregled**: klik na fotografiju otvara je preko celog ekrana sa opcijom preuzimanja i navigacijom strelicama/tasterima.
- **Admin prijava**: dugme "Prijava" u gornjem desnom uglu. Nakon prijave admin vidi dugme za brisanje na svakoj fotografiji (i u fullscreen prikazu).
- **Bezbednost**: brisanje fotografija je zaštićeno JWT tokenom koji se izdaje samo nakon tačne prijave; token važi 12h.

## Deploy na Render (test okruženje)

Repozitorijum sadrži `render.yaml` koji jednim klikom postavlja i backend i frontend na [Render](https://render.com)-u (besplatan plan):

1. Napravite besplatan nalog na [cloudinary.com](https://cloudinary.com) i sa dashboard-a uzmite `Cloud name`, `API Key` i `API Secret`.
2. Push-ujte ovaj repozitorijum na GitHub (privatan ili javan, oboje radi).
3. Na Render-u: **New +** → **Blueprint** → povežite repozitorijum. Render čita `render.yaml` i pravi dva servisa:
   - `wedding-gallery-api`: Node backend (free web service, "usnula" posle 15 min neaktivnosti, ~30-60s da se probudi na sledeći zahtev).
   - `wedding-gallery`: statički frontend build (free, uvek dostupan bez uspavljivanja).
4. Kad Render zatraži vrednosti za promenljive označene kao secret (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CLOUDINARY_*`), unesite ih. `CORS_ORIGIN` i `VITE_API_URL` se automatski povezuju između servisa (`fromService` u `render.yaml`), nema ručnog kopiranja URL-ova.
5. Kliknite **Apply**. Za par minuta aplikacija je dostupna na `https://wedding-gallery.onrender.com` (ili sličnom Render URL-u).

Za pravi domen (npr. `andrijana-darko.com`), kupite ga kod registrara po izboru i u Render dashboard-u, pod frontend servisom, dodajte ga kao **Custom Domain**. Render će dati CNAME/A zapise koje treba uneti kod registrara.

## Napomena o administratorskoj lozinki

Lozinka `andrijanadarko357` je postavljena u `backend/.env`. Ako aplikaciju hostujete javno, razmislite o promeni na jaču lozinku i obavezno promenite `JWT_SECRET`.
