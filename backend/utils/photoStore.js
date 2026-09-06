const { cloudinary, FOLDER } = require("./cloudinary");

// Cloudinary is the source of truth: every asset lives in FOLDER and carries
// uploaderName/uploadedAt as context metadata, so there's no separate database
// to keep in sync (and nothing to lose on a redeploy).
//
// This uses the classic Admin "list resources" API rather than the Search API:
// Search runs against a separate index that can lag behind an upload by anywhere
// from seconds to minutes, which made just-uploaded photos vanish from the
// gallery until the index caught up. The classic API reflects uploads immediately.
//
// The gallery paginates in the route layer, but Cloudinary's list API can't be
// sorted by our custom uploadedAt context field, so every page still needs the
// full listing sorted in memory. This short-lived cache means an infinite-scroll
// session only pays for that Admin API call once instead of once per page.
const LIST_CACHE_TTL_MS = 15000;
let listCache = null; // { data, expiresAt }

async function getAllSortedNewestFirst() {
  if (listCache && listCache.expiresAt > Date.now()) {
    return listCache.data;
  }

  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: `${FOLDER}/`,
    context: true,
    max_results: 500,
  });

  const photos = result.resources
    .map(resourceToPhoto)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  listCache = { data: photos, expiresAt: Date.now() + LIST_CACHE_TTL_MS };
  return photos;
}

function invalidateCache() {
  listCache = null;
}

async function getPhotoById(id) {
  try {
    const resource = await cloudinary.api.resource(`${FOLDER}/${id}`, { context: true });
    return resourceToPhoto(resource);
  } catch (err) {
    if (err.http_code === 404) return null;
    throw err;
  }
}

async function removePhoto(id) {
  const result = await cloudinary.uploader.destroy(`${FOLDER}/${id}`);
  invalidateCache();
  return result;
}

function resourceToPhoto(resource) {
  const context = resource.context?.custom || {};
  return {
    id: resource.public_id.slice(FOLDER.length + 1),
    url: resource.secure_url,
    uploaderName: context.uploaderName || null,
    uploadedAt: context.uploadedAt || resource.created_at,
    contentHash: context.contentHash || null,
  };
}

module.exports = {
  getAllSortedNewestFirst,
  getPhotoById,
  removePhoto,
  invalidateCache,
};
