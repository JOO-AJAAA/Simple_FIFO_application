document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
  const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse && window.innerWidth < 992) {
      bsCollapse.hide();
    }
  });
});

const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
link.classList.remove('active');
if (link.getAttribute('href') === currentPath) {
  link.classList.add('active');
  }
});