const API_URL = import.meta.env.VITE_API_URL || "";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, keep in sync with backend (Cloudinary's single-upload limit)

// Front-end validation so people get instant feedback before we even hit the network.
export function validateFiles(files) {
  const valid = [];
  const errors = [];

  for (const file of files) {
    const extMatch = file.name.match(/\.[0-9a-z]+$/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : "";
    const typeOk =
      ALLOWED_TYPES.includes(file.type) || [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"].includes(ext);

    if (!typeOk) {
      errors.push(`${file.name}: nije podržan format slike.`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: fajl je prevelik (maksimum 10MB).`);
      continue;
    }
    valid.push(file);
  }

  return { valid, errors };
}

export async function fetchPhotos() {
  const res = await fetch(`${API_URL}/api/photos`);
  if (!res.ok) throw new Error("Neuspešno učitavanje fotografija.");
  const data = await res.json();
  return data.photos;
}

export async function uploadPhotos(files, uploaderName, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));
    if (uploaderName) formData.append("uploaderName", uploaderName);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/photos`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.photos);
        } else {
          reject(new Error(data.error || "Otpremanje nije uspelo."));
        }
      } catch (err) {
        reject(new Error("Otpremanje nije uspelo."));
      }
    };

    xhr.onerror = () => reject(new Error("Greška u mreži. Proverite internet konekciju."));
    xhr.send(formData);
  });
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Prijava nije uspela.");
  return data.token;
}

export async function deletePhoto(id, token) {
  const res = await fetch(`${API_URL}/api/photos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Brisanje nije uspelo.");
  return true;
}

export function photoUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path}`;
}
