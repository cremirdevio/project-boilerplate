import './LazyLoad.scss';

const LazyLoad = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const lazyloadImages = document.querySelectorAll('.lazy-image');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        const dataSrc = image.getAttribute('data-src');
                        import(/* webpackMode: "eager" */ `../../images/${dataSrc}`).then((src) => {
                            image.setAttribute('src', src.default);
                        });
                        imageObserver.unobserve(image);
                    }
                });
            });

            lazyloadImages.forEach((image) => {
                imageObserver.observe(image);
            });
        } else {
            /* in case IntersectionObserver is not supported */
            let lazyloadThrottleTimeout;

            const lazyload = () => {
                if (lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }

                lazyloadThrottleTimeout = setTimeout(() => {
                    let scrollTop = window.pageYOffset;

                    lazyloadImages.forEach((img) => {
                        if (img.offsetTop < window.innerHeight + scrollTop) {
                            const dataSrc = img.getAttribute('data-src');
                            import(/* webpackMode: "lazy" */ `../../images/${dataSrc}`).then((src) => {
                                img.setAttribute('src', src.default);
                            });
                        }
                    });

                    if (lazyloadImages.length == 0) {
                        document.removeEventListener('scroll', lazyload);
                        window.removeEventListener('resize', lazyload);
                        window.removeEventListener('orientationChange', lazyload);
                    }
                }, 20);
            };

            document.addEventListener('scroll', lazyload);
            window.addEventListener('resize', lazyload);
            window.addEventListener('orientationChange', lazyload);
        }
    });
};

export default LazyLoad;
