// claude install manual — TOC toggle, copy buttons, scroll-spy

(() => {
    // ── mobile TOC toggle
    const toc = document.getElementById('toc');
    const tocToggle = document.getElementById('toc-toggle');

    if (toc && tocToggle) {
        tocToggle.addEventListener('click', () => {
            const open = toc.classList.toggle('open');
            tocToggle.textContent = open ? '閉じる' : '目次';
        });

        // close TOC when a link inside it is clicked (mobile)
        toc.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && window.innerWidth <= 1100) {
                toc.classList.remove('open');
                tocToggle.textContent = '目次';
            }
        });
    }

    // ── inject copy buttons onto every <pre>
    document.querySelectorAll('pre').forEach((pre) => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.type = 'button';
        btn.textContent = 'copy';
        btn.setAttribute('aria-label', 'コードをコピー');

        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.innerText : pre.innerText;
            try {
                await navigator.clipboard.writeText(text);
                btn.textContent = 'copied';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'copy';
                    btn.classList.remove('copied');
                }, 1600);
            } catch {
                // fallback: select the text so user can copy manually
                const range = document.createRange();
                range.selectNodeContents(code || pre);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                btn.textContent = 'select';
                setTimeout(() => { btn.textContent = 'copy'; }, 1600);
            }
        });

        pre.appendChild(btn);
    });

    // ── scroll-spy: highlight active TOC item
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const tocLinks = new Map();
    document.querySelectorAll('.toc a').forEach((a) => {
        const id = a.getAttribute('href').replace('#', '');
        tocLinks.set(id, a);
    });

    if (sections.length && tocLinks.size && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    tocLinks.forEach((link) => link.classList.remove('active'));
                    const link = tocLinks.get(entry.target.id);
                    if (link) link.classList.add('active');
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        });

        sections.forEach((s) => observer.observe(s));
    }
})();
