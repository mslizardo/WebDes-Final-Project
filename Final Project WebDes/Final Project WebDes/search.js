document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');

  if (!searchForm || !searchInput) return;

  const filterProducts = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const noResultsBox = document.getElementById('search-no-results');

    let visibleCount = 0;

    productCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const matches = !normalizedQuery || title.includes(normalizedQuery) || text.includes(normalizedQuery);
      card.classList.toggle('d-none', !matches);
      if (matches) visibleCount += 1;
    });

    if (noResultsBox) {
      noResultsBox.classList.toggle('d-none', visibleCount !== 0);
    }
  };

  const queryParam = new URLSearchParams(window.location.search).get('q') || '';
  if (queryParam) {
    searchInput.value = queryParam;
  }

  if (window.location.pathname.toLowerCase().includes('shop.html')) {
    filterProducts(queryParam);
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (window.location.pathname.toLowerCase().includes('shop.html')) {
      const url = new URL(window.location.href);
      if (query) {
        url.searchParams.set('q', query);
      } else {
        url.searchParams.delete('q');
      }
      history.replaceState({}, '', url.toString());
      filterProducts(query);
      return;
    }

    const targetUrl = new URL('shop.html', window.location.href);
    if (query) {
      targetUrl.searchParams.set('q', query);
    }
    window.location.href = targetUrl.toString();
  });
});
