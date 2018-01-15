(function ($) {
    const routes = {
        home: renderHomePageContent,
        tasks: renderTasksPageContent,
        employees: renderEmployeesPageContent,
        gallery: renderGalleryPageContent,
        contacts: renderContactsPageContent
    };

    const defaultPerPage = 10;
    let galleryContentData = null;

    //slick slider
    function initMainSlider() {
        $(".js-main-slider").slick({
            prevArrow: $(".js-main-slider-prev"),
            nextArrow: $(".js-main-slider-next"),
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 1000
        });
    }

    //render pages
    function handleHashChange() {
        const content = $("#content");
        const hash = location.hash;
        const pageName = getPageName(hash);
        const params = getQueryParameters(hash);

        renderPage(pageName, content, params);
    }

    function getPageName(hash) {
        const url = hash.slice(2);
        const pageName = url.split("?")[0];

        if (pageName === "") {
            return "home";
        }
        return pageName;
    }

    function getQueryParameters(hash) {
        const url = hash.split("?")[1];
        const params = {};

        if (url) {
            url.split("&").forEach(function (item) {
                const paramPair = item.split('=');

                if (!isNaN(+paramPair[1])) {
                    paramPair[1] = +paramPair[1];
                }

                params[paramPair[0]] = paramPair[1];
            });
        }
        return params;
    }

    function renderPage(pageName, contentWrapper, params) {
        contentWrapper.html('');
        if (routes[pageName]) {
            routes[pageName](contentWrapper, params);
        } else {
            renderNotFoundPage(contentWrapper);
        }
    }

    function renderTasksPageContent(contentWrapper) {
        contentWrapper.html("tasks");
    }

    function renderEmployeesPageContent(contentWrapper) {
        contentWrapper.html("employees");
    }

    function getGalleryData() {
        return axios.get("/mock/gallery.json").then(response => response.data);
    }

    function renderGalleryPageContent(contentWrapper, params) {
        let currentPage = params.page && !isNaN(params.page) ? params.page : 1;

        if (!galleryContentData) {
            getGalleryData().then(galleryData => {
                galleryContentData = galleryData;
                createGalleryPage(contentWrapper, galleryContentData, currentPage);
            });
        } else {
            createGalleryPage(contentWrapper, galleryContentData, currentPage);
        }
    }

    function createGalleryPage(contentWrapper, galleryContentData, currentPage) {
        const paginatedData = getPaginatedData(galleryContentData, currentPage);
        const pagination = getPagination(galleryContentData, currentPage);
        let pageContent = $('<div></div>');

        pageContent.append(getGalleryContent(paginatedData));
        pageContent.append(pagination);
        contentWrapper.append(pageContent);
    }

    function renderContactsPageContent(contentWrapper) {
        let container = '<div class="contact-page">';
        const contacts = '<div class="contacts">'+
            '<div class="contacts-adresses-numbers">' +
            '<p>Address: country, town, street</p>' +
            '<p>Phone number: 000 000 000</p>' +
            '<p>Phone number: 999 999 999</p>' +
            '<p>Email: qwerty@asdf.com</p>' +
            '</div>' +
            '</div>';
        const map = '<div class="map-place">' +
            '<h3>WE ARE HERE</h3>' +
            '<iframe width="100%" height="100%" id="gmap_canvas" src="https://maps.google.com/maps?q=khreshchatyk street&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>' +
            '</div>';
        container += contacts;
        container += map;
        container += '</div>';

        contentWrapper.html(container);
    }

    function renderHomePageContent(contentWrapper) {
        contentWrapper.html("home");
    }

    function renderNotFoundPage(contentWrapper) {
        contentWrapper.html("404");
    }

    function getPaginatedData(dataArray, page, perPage) {
        perPage = perPage || defaultPerPage;

        let startShow = (page - 1) * perPage + 1;
        let endShow = startShow + perPage;

        if (page === 1) {
            return dataArray.slice(0, perPage);
        }
        return dataArray.slice(startShow, endShow);
    }

    function getPagination(dataArray, currentPage, perPage) {
        perPage = perPage || defaultPerPage;

        let paginatorContent = $('<div class="pagination"></div>');
        let totalPages = Math.ceil(dataArray.length / perPage);
        let paginationItem;

        for (let i = 1; i <= totalPages; i++) {
            if (currentPage === i) {
                paginationItem = $('<span class="pagination-item"></span>');
                paginationItem.addClass('disabled');
            } else {
                paginationItem = $('<a class="pagination-item"></a>');
                paginationItem.attr('href', '/#/gallery?page=' + i);
            }

            paginationItem.html(i);
            console.log(paginationItem);
            paginatorContent.append(paginationItem);
        }

        return paginatorContent;
    }

    //create gallery content
    function getGalleryContent(galleryData) {
        const galleryWrapper = $('<div class="gallery"></div>');

        galleryData.forEach(item => {
            galleryWrapper.append(getGalleryItem(item));
        });

        return galleryWrapper;
    }

    //create gallery item
    function getGalleryItem(galleryItemData) {
        const elementWrapper = $('<div class="gallery-item"></div>');
        const galleryImage = $(
            '<div class="gallery-picture" style="background-image: url(' +
            galleryItemData.url +
            ')"></div>'
        );
        const galleryItemContent = $(
            "<div class='description'><p class='photo-title'>" +
            galleryItemData.title +
            "</p><p class='photo-description'>" +
            galleryItemData.description +
            "</p></div></div>"
        );
        elementWrapper.append(galleryImage);
        elementWrapper.append(galleryItemContent);

        return elementWrapper;
    }

    // open/closed collapsed-menu
    function toggleCollapsedMenu() {
        const $menuCollapsedBtn = $("#menu-collapsed-btn");
        const $menuCollapsed = $("#menu-collapsed");

        $(document).click(function (event) {
            $menuCollapsed.hide();
        });

        $menuCollapsedBtn.click(function (event) {
            event.stopPropagation();

            $menuCollapsed.toggle();
        });
    }

    $(document).ready(function () {
        initMainSlider();
        toggleCollapsedMenu();

        $(window).on("hashchange", handleHashChange);
        $(window).trigger("hashchange");
    });
})(jQuery);
