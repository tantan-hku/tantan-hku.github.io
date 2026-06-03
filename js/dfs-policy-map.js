(function () {
  const MAP_LOCALE = (() => {
    const lang = document.documentElement.lang;
    if (lang === 'zh-CN') return 'zh-sc';
    if (lang === 'zh-HK') return 'zh';
    return 'en';
  })();
  const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

  const POLICIES = {
    en: [
      { id: 'us', name: 'US', type: 'guidance', lon: -98, lat: 40, policy: 'Guidelines for Addressing Occupational Hazards and Risks in Design and Redesign Processes' },
      { id: 'ie', name: 'Ireland', type: 'mandated', lon: -7.5, lat: 53.5, policy: 'Safety, Health and Welfare at Work (Construction) Regulations 2013 (enforced August 2013)' },
      { id: 'es', name: 'Spain', type: 'mandated', lon: -3.5, lat: 40, policy: 'Royal Decree 1627/1997' },
      { id: 'uk', name: 'UK', type: 'mandated', lon: -1.5, lat: 54, policy: 'Construction Design and Management (CDM) Regulations 2015' },
      { id: 'se', name: 'Sweden', type: 'mandated', lon: 16, lat: 63, policy: 'Building and Civil Engineering Work (AFS 1999:3)' },
      { id: 'dk', name: 'Denmark', type: 'mandated', lon: 10, lat: 56, policy: 'Executive Order no. 117' },
      { id: 'fi', name: 'Finland', type: 'mandated', lon: 26, lat: 64, policy: 'Safety of Construction Work (205/2009)' },
      { id: 'za', name: 'South Africa', type: 'mandated', lon: 25, lat: -29, policy: 'Section 10 of the OHS Act 85/93' },
      { id: 'kr', name: 'South Korea', type: 'mandated', lon: 127.5, lat: 36, policy: 'Enforcement Decree of the Construction Technology Promotion Act 2016' },
      { id: 'hk', name: 'Hong Kong', type: 'guidance', lon: 114.2, lat: 22.3, policy: 'Guidance Notes and Worked Examples of Design for Safety (2013); Pictorial Guide to Planning and Design for Safety (2017)' },
      { id: 'my', name: 'Malaysia', type: 'guidance', lon: 101.7, lat: 4.2, policy: 'Guideline on Occupational Safety and Health in Construction Industry (Management) 2017' },
      { id: 'sg', name: 'Singapore', type: 'mandated', lon: 103.8, lat: 1.3, policy: 'Design for Safety (DfS) regulation (enacted July 2015, enforced August 2016)' },
      { id: 'au', name: 'Australia', type: 'mandated', lon: 133, lat: -25, policy: 'Work Health and Safety (WHS) Act (since 2012)' },
      { id: 'nz', name: 'New Zealand', type: 'mandated', lon: 174, lat: -41, policy: 'Health and Safety at Work Act 2015' }
    ],
    zh: [
      { id: 'us', name: '美國', type: 'guidance', lon: -98, lat: 40, policy: '設計與再設計過程中職業危害與風險處理指引' },
      { id: 'ie', name: '愛爾蘭', type: 'mandated', lon: -7.5, lat: 53.5, policy: '2013 年《營造業安全、健康與福利法規》（2013 年 8 月實施）' },
      { id: 'es', name: '西班牙', type: 'mandated', lon: -3.5, lat: 40, policy: '皇家法令 1627/1997' },
      { id: 'uk', name: '英國', type: 'mandated', lon: -1.5, lat: 54, policy: '2015 年《建造設計與管理（CDM）法規》' },
      { id: 'se', name: '瑞典', type: 'mandated', lon: 16, lat: 63, policy: '建築與土木工程工作（AFS 1999:3）' },
      { id: 'dk', name: '丹麥', type: 'mandated', lon: 10, lat: 56, policy: '行政命令第 117 號' },
      { id: 'fi', name: '芬蘭', type: 'mandated', lon: 26, lat: 64, policy: '建造工作安全（205/2009）' },
      { id: 'za', name: '南非', type: 'mandated', lon: 25, lat: -29, policy: '《職業安全與健康法》第 10 條（85/93）' },
      { id: 'kr', name: '南韓', type: 'mandated', lon: 127.5, lat: 36, policy: '2016 年《建造技術促進法施行令》' },
      { id: 'hk', name: '香港', type: 'guidance', lon: 114.2, lat: 22.3, policy: '《建築安全設計指引與實例》（2013）；2017 年安全規劃與設計圖解指南' },
      { id: 'my', name: '馬來西亞', type: 'guidance', lon: 101.7, lat: 4.2, policy: '2017 年建造業職安健管理指引' },
      { id: 'sg', name: '新加坡', type: 'mandated', lon: 103.8, lat: 1.3, policy: '建築安全設計法規（2015 年 7 月頒布，2016 年 8 月實施）' },
      { id: 'au', name: '澳洲', type: 'mandated', lon: 133, lat: -25, policy: '2012 年起《工作健康與安全（WHS）法》' },
      { id: 'nz', name: '紐西蘭', type: 'mandated', lon: 174, lat: -41, policy: '2015 年《工作健康與安全法》' }
    ],
    'zh-sc': [

      { id: 'us', name: '美国', type: 'guidance', lon: -98, lat: 40, policy: '设计与再设计过程中职业危害与风险处理指引' },
      { id: 'ie', name: '爱尔兰', type: 'mandated', lon: -7.5, lat: 53.5, policy: '2013 年《营造业安全、健康与福利法规》（2013 年 8 月实施）' },
      { id: 'es', name: '西班牙', type: 'mandated', lon: -3.5, lat: 40, policy: '皇家法令 1627/1997' },
      { id: 'uk', name: '英国', type: 'mandated', lon: -1.5, lat: 54, policy: '2015 年《建造设计与管理（CDM）法规》' },
      { id: 'se', name: '瑞典', type: 'mandated', lon: 16, lat: 63, policy: '建筑与土木工程工作（AFS 1999:3）' },
      { id: 'dk', name: '丹麦', type: 'mandated', lon: 10, lat: 56, policy: '行政命令第 117 号' },
      { id: 'fi', name: '芬兰', type: 'mandated', lon: 26, lat: 64, policy: '建造工作安全（205/2009）' },
      { id: 'za', name: '南非', type: 'mandated', lon: 25, lat: -29, policy: '《职业安全与健康法》第 10 条（85/93）' },
      { id: 'kr', name: '南韩', type: 'mandated', lon: 127.5, lat: 36, policy: '2016 年《建造技术促进法施行令》' },
      { id: 'hk', name: '香港', type: 'guidance', lon: 114.2, lat: 22.3, policy: '《建筑安全设计指引与实例》（2013）；2017 年安全规划与设计图解指南' },
      { id: 'my', name: '马来西亚', type: 'guidance', lon: 101.7, lat: 4.2, policy: '2017 年建造业职安健管理指引' },
      { id: 'sg', name: '新加坡', type: 'mandated', lon: 103.8, lat: 1.3, policy: '建筑安全设计法规（2015 年 7 月颁布，2016 年 8 月实施）' },
      { id: 'au', name: '澳洲', type: 'mandated', lon: 133, lat: -25, policy: '2012 年起《工作健康与安全（WHS）法》' },
      { id: 'nz', name: '纽西兰', type: 'mandated', lon: 174, lat: -41, policy: '2015 年《工作健康与安全法》' }
    ]
  };

  const COPY = {
    en: { loadError: 'Map data could not be loaded. Please refresh the page.' },
    zh: { loadError: '地圖資料載入失敗，請重新整理頁面。' },
    'zh-sc': { loadError: '地图资料载入失败，请重新整理页面。' }
  };

  function isChineseLocale(locale) {
    return locale === 'zh' || locale === 'zh-sc';
  }

  function initPolicyMap(root) {
    if (!root || typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

    const locale = root.dataset.locale || MAP_LOCALE;
    const policies = POLICIES[locale] || POLICIES.en;
    const copy = COPY[locale] || COPY.en;

    const stage = root.querySelector('.policy-map-canvas') || root.querySelector('.policy-map-stage');
    const detail = root.querySelector('.policy-map-detail');
    const detailTitle = root.querySelector('.policy-map-detail-title');
    const detailText = root.querySelector('.policy-map-detail-text');
    if (!stage || !detail || !detailTitle || !detailText) return;

    let activeId = null;
    let lockedId = null;
    let svgSel = null;
    let markerSel = null;
    let resizeTimer = null;

    function setActive(id) {
      activeId = id;
      root.classList.toggle('has-active', Boolean(id));
      if (markerSel) {
        markerSel.classed('is-active', (d) => d.id === id);
      }
      const item = policies.find((p) => p.id === id);
      if (item) {
        detail.dataset.type = item.type;
        detailTitle.textContent = item.name + (isChineseLocale(locale) ? '：' : ': ');
        detailText.textContent = item.policy;
      } else {
        detail.removeAttribute('data-type');
        detailTitle.textContent = '';
        detailText.textContent = '';
      }
    }

    setActive(null);

    async function renderMap() {
      const width = Math.max(stage.clientWidth, 320);
      const height = Math.round(width * 0.5);
      stage.innerHTML = '';

      try {
        const land = await d3.json(LAND_URL);
        const landFeature = topojson.feature(land, land.objects.land);

        const svg = d3
          .select(stage)
          .append('svg')
          .attr('class', 'policy-map-svg')
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('role', 'img')
          .attr('aria-label', isChineseLocale(locale) ? (locale === 'zh-sc' ? '全球安全设计政策地图' : '全球安全設計政策地圖') : 'World map of Design for Safety policies');

        const projection = d3.geoNaturalEarth1().fitExtent(
          [[24, 18], [width - 24, height - 18]],
          landFeature
        );
        const path = d3.geoPath(projection);

        const gMap = svg.append('g').attr('class', 'policy-map-world');

        gMap
          .append('path')
          .datum(landFeature)
          .attr('class', 'policy-map-land')
          .attr('d', path);

        const gMarkers = svg.append('g').attr('class', 'policy-map-markers');

        const markerData = policies
          .map((p) => {
            const pt = projection([p.lon, p.lat]);
            if (!pt) return null;
            return { ...p, x: pt[0], y: pt[1] };
          })
          .filter(Boolean);

        markerSel = gMarkers
          .selectAll('.policy-map-marker')
          .data(markerData, (d) => d.id)
          .join('g')
          .attr('class', (d) => `policy-map-marker policy-map-marker--${d.type}`)
          .attr('data-id', (d) => d.id)
          .attr('transform', (d) => `translate(${d.x},${d.y})`)
          .attr('tabindex', 0)
          .attr('role', 'button')
          .style('opacity', 0)
          .on('mouseenter', (_, d) => {
            if (!lockedId) setActive(d.id);
          })
          .on('mouseleave', () => {
            if (!lockedId) setActive(null);
          })
          .on('click', (_, d) => {
            if (lockedId === d.id) {
              lockedId = null;
              root.classList.remove('is-locked');
              setActive(null);
            } else {
              lockedId = d.id;
              root.classList.add('is-locked');
              setActive(d.id);
            }
          });

        markerSel
          .append('circle')
          .attr('class', 'policy-map-pulse')
          .attr('r', 14);

        markerSel
          .append('circle')
          .attr('class', 'policy-map-dot')
          .attr('r', 5.5);

        markerSel
          .transition()
          .delay((_, i) => 500 + i * 55)
          .duration(420)
          .style('opacity', 1);

        gMap.select('.policy-map-land')
          .attr('stroke-dasharray', function () {
            return this.getTotalLength();
          })
          .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
          })
          .transition()
          .duration(1400)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);

        svgSel = svg;
        if (activeId || lockedId) setActive(lockedId || activeId);
      } catch (err) {
        stage.innerHTML = `<p class="policy-map-error">${copy.loadError}</p>`;
        console.error(err);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            root.classList.add('is-visible');
            renderMap();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(root);

    window.addEventListener('resize', () => {
      if (!root.classList.contains('is-visible')) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderMap, 200);
    });
  }

  function boot() {
    document.querySelectorAll('[data-policy-map]').forEach(initPolicyMap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
