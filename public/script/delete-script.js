function redirectToDelete() {
  const currentUrl = window.location.href;
  const deleteUrl = currentUrl + "/delete";
  window.location.href = deleteUrl;
}