

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('suggestions');
    const categoryCheckboxes = document.querySelectorAll('.category-filter');
    const priceFilters = document.querySelectorAll('.price-set');
    let currentPage = 1;
    let isloading = false;
    let hasmore = true;
    let searchquery = '';
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');

    window.addEventListener('pageshow', function (event) {
        let filters = false;
        console.log("page showed");
        priceFilters.forEach(filter => {
            if (filter.value !== null && filter.value !== '') {
                filters = true;
            }
        });
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                filters = true;
            }
        });
        if (filters) {
            console.log("page showed and filters applied");
            applyFilters();
        }
    });


    if (categoryId) {
        const checkbox = document.querySelector(`.category-filter[value="${categoryId}"]`);
        if (checkbox) {
            checkbox.checked = true;

        }
    }

    function isBottomOfPage() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 250;
    }
    function loadNextPage() {
        if (isloading || !hasmore) return;
        isloading = true;
        loadingIndicator.style.display = 'block';
        currentPage++;

        applyFilters(true);
    }
    function applyFilters(isAppending = false) {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.value)); 
        const minPrice = document.getElementById('price-from').value;
        const maxPrice = document.getElementById('price-to').value;

        const minPriceValue = minPrice ? parseInt(minPrice) : null;
        const maxPriceValue = maxPrice ? parseInt(maxPrice) : null;

        if (minPriceValue !== null && minPriceValue < 0) {
            document.getElementById('price-from').value = '';
            return;
        }
        if (maxPriceValue !== null && maxPriceValue < 0) {
            document.getElementById('price-to').value = '';
            return;
        }

        if (!isAppending) {
            currentPage = 1;
            hasmore = true;
        }

        const params = new URLSearchParams();
        selectedCategories.forEach(cat => params.append('categories', cat));
        //console.log(searchquery);
        params.append('searchquery', searchquery);

        if (minPriceValue !== null) params.append('minprice', minPriceValue);
        if (maxPriceValue !== null) params.append('maxprice', maxPriceValue);

        params.append('page', currentPage);

        fetch(`/CarParts/FilterCarParts?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                hasmore = response.headers.get('X-Has-Next') === 'True';
                return response.text();
            })
            .then(html => {
                productContainer = document.querySelector('.products');
                if (!isAppending) {
                    const button = productContainer.querySelector('.add-option');
                    productContainer.innerHTML = '';
                    productContainer.insertAdjacentHTML('beforeend', html);
                    productContainer.appendChild(button);
                    currentPage = 1;
                }
                else {
                    const button = productContainer.querySelector('.add-option');
                    //productContainer.innerHTML = '';
                    productContainer.insertAdjacentHTML('beforeend', html);
                    productContainer.appendChild(button);
                    //currentPage++;
                    console.log(currentPage);
                }
                //document.querySelector('.products').innerHTML = html;
            })
            .catch(error => {
                console.error('������ ��� ����������:', error);
            })
            .finally(() => {
                isloading = false;
                loadingIndicator.style.display = 'none';
            });
    }
    function fetchSuggestions(query) {
        //console.log(query);
        if (query.length < 2) {
            searchSuggestions.style.display = 'none';
            return;
            
        }
        fetch(`/CarParts/GetSuggestions?query=${encodeURIComponent(query)}`, {method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json()})
            .then(suggestions => {
                //console.log('Received suggestions:', suggestions);
                if (suggestions.length > 0) {
                    searchSuggestions.innerHTML = '';
                    suggestions.forEach(item => {
                        const suggestion = document.createElement('div');
                        suggestion.className = 'suggestion-item';
                        suggestion.textContent = item.name;
                        //console.log(item.name);
                        suggestion.addEventListener('click', function () {
                            searchInput.value = item.name;
                            searchSuggestions.style.display = 'none';
                            searchquery = item.name;
                            clearFilters();
                            //console.log(searchquery);
                            applyFilters(false);
                        });
                        searchSuggestions.appendChild(suggestion);
                        //console.log(searchSuggestions);
                    });
                    searchSuggestions.style.display = 'block';
                } else {
                    searchSuggestions.style.display = 'none';
                }
            })

    }

    searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        fetchSuggestions(query);
    });

    searchInput.addEventListener('focus', function () {
        if (this.value.trim().length > 0) {
            fetchSuggestions(this.value.trim());
        }
    });

    searchInput.addEventListener('blur', function () {
        setTimeout(() => {
            searchSuggestions.style.display = 'none';
        }, 200);
    });

    searchButton.addEventListener('click', function () {
        searchquery = searchInput.value.trim();
        searchSuggestions.style.display = 'none';
        applyFilters(false);
    });

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => applyFilters(false));
    });

    priceFilters.forEach(input => {
        let timeout;
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(applyFilters, 450);
        });

    });

    window.addEventListener('scroll', function () {
        if (isBottomOfPage()) {
            loadNextPage()
        }
    });

    document.getElementById("filterclear").addEventListener('click', function () {
        clearFilters();
        searchInput.value = '';
        searchquery = '';
        applyFilters(false);
        
    })

   
    

    function clearFilters() {
        priceFilters.forEach(input => {
            input.value = '';
        })
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        })
    }

});
