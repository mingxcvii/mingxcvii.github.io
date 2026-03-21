document.addEventListener('DOMContentLoaded', () => {

    // --- Animation Helper ---
    function triggerAnimations(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const cards = container.querySelectorAll('.intel-card, .timeline-content');

        cards.forEach(c => c.classList.remove('animate-in'));

        setTimeout(() => {
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 80);
            });
        }, 50);
    }

    // --- Tab Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            
            

            const targetTabId = `tab-${tabName}`;
            document.getElementById(targetTabId).classList.add('active');

            // Refresh data and sorting when switching tabs
            if (tabName === 'worldboss') renderWorldBoss();
            if (tabName === 'battlefield') renderBattlefield();
            
            // Sync countdowns immediately after rendering new tab content
            if (typeof updateAllCountdowns === 'function') updateAllCountdowns();

            triggerAnimations(targetTabId === 'tab-worldboss' ? 'worldboss-grid' :
                targetTabId === 'tab-reflection' ? 'reflection-grid' : 'battlefield-timeline');
        });
    });

    // --- Battlefield Reward Intel Toggle ---
    const intelToggle = document.getElementById('bf-intel-toggle');
    const intelPanel = document.getElementById('bf-intel-panel');

    if (intelToggle && intelPanel) {
        intelToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            intelToggle.classList.toggle('active');
            intelPanel.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!intelPanel.contains(e.target) && !intelToggle.contains(e.target)) {
                intelToggle.classList.remove('active');
                intelPanel.classList.remove('active');
            }
        });
    }

    // --- Live Clock Logic ---
    const timeDisplay = document.getElementById('system-time');
    function updateClock() {
        const now = new Date();
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- Parse Boss Schedules for Countdown ---
    function getParsedSchedules(timeStrings) {
        const daysMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
        let schedules = [];

        timeStrings.forEach(ts => {
            let tokens = ts.split(/\s+/);
            let daysToParse = [];
            let times = [];

            tokens.forEach(token => {
                let cleanToken = token.replace(':', '').replace(',', '');
                if (token === '-') {
                    daysToParse.push('-');
                } else if (daysMap[cleanToken] !== undefined) {
                    daysToParse.push(daysMap[cleanToken]);
                } else if (token.includes(':')) {
                    let parts = token.split(':');
                    times.push({ h: parseInt(parts[0]), m: parseInt(parts[1]) });
                }
            });

            let activeDays = [];
            if (daysToParse.length === 0) {
                activeDays = [0, 1, 2, 3, 4, 5, 6]; // Everyday
            } else {
                for (let i = 0; i < daysToParse.length; i++) {
                    if (daysToParse[i] === '-') {
                        let start = activeDays.pop();
                        let end = daysToParse[i + 1];
                        activeDays.push(start);
                        let d = start;
                        while (d !== end) {
                            d = (d + 1) % 7;
                            if (!activeDays.includes(d)) activeDays.push(d);
                        }
                        i++;
                    } else {
                        if (!activeDays.includes(daysToParse[i])) activeDays.push(daysToParse[i]);
                    }
                }
            }

            activeDays.forEach(d => {
                times.forEach(t => {
                    schedules.push({ day: d, h: t.h, m: t.m });
                });
            });
        });
        return schedules;
    }

    function getNextSpawnMs(schedules, now) {
        if (!now) now = new Date();
        let minMs = Infinity;

        schedules.forEach(sch => {
            let d = new Date(now);
            d.setHours(sch.h, sch.m, 0, 0);

            let dayDiff = sch.day - now.getDay();
            if (dayDiff < 0) dayDiff += 7;

            d.setDate(now.getDate() + dayDiff);

            // If time has passed today (including 10 mins 'ACTIVE' window), move to next occurrence
            if (d.getTime() + 600000 <= now.getTime()) {
                d.setDate(d.getDate() + 7);
            }

            let msToSpawn = d.getTime() - now.getTime();
            // If currently in active window (0 to -10 mins), treat as 0 for sorting
            if (msToSpawn < 0 && msToSpawn >= -600000) {
                msToSpawn = 0; 
            } else if (msToSpawn < -600000) {
                // Truly in the past for this day, should have been moved forward
                // This is a safety catch
                return;
            }

            if (msToSpawn < minMs) {
                minMs = msToSpawn;
            }
        });

        return minMs === Infinity ? 999999999 : minMs;
    }

    // --- Render World Boss Data ---
    function renderWorldBoss() {
        try {
            const wbGrid = document.getElementById('worldboss-grid');
            if (!wbGrid || typeof worldBossData === 'undefined') return;

            // Use a Map to cache parsed schedules during sort for better performance
            const scheduleMap = new Map();
            const getCachedSchedules = (boss) => {
                if (!scheduleMap.has(boss.name)) {
                    scheduleMap.set(boss.name, getParsedSchedules(boss.times));
                }
                return scheduleMap.get(boss.name);
            };

            const sortedBossData = [...worldBossData].sort((a, b) => {
                const nextA = getNextSpawnMs(getCachedSchedules(a), new Date());
                const nextB = getNextSpawnMs(getCachedSchedules(b), new Date());
                return nextA - nextB;
            });

            // Map content
            const content = sortedBossData.map(boss => {
                const bossImagesHtml = boss.images.map(img => `<img src="${img}" alt="Boss">`).join('');
                const schedules = getCachedSchedules(boss);
                const schedulesJson = JSON.stringify(schedules).replace(/"/g, '&quot;');
                const names = boss.name.split('/').map(s => s.trim());
                const displayTitle = names.length > 1 ? names.join(' & ') : names[0];

                return `
                  <div class="intel-card animate-in" data-boss-name="${boss.name}">
                      <div class="card-character-header">
                          ${bossImagesHtml}
                      </div>
                      <div class="card-body">
                          <h3 class="card-title">${displayTitle}</h3>
                          <div class="countdown-container">
                              <div class="countdown-tag" data-schedules="${schedulesJson}">
                                  <img src="image/monstertype.png" class="wb-status-icon" alt="icon"> CALCULATING...
                              </div>
                          </div>
                          <button class="intel-action-btn" onclick="openIntelModal('${boss.name}')">
                              <i class="fa-solid fa-radar"></i> SHOW ON MAP
                          </button>
                      </div>
                  </div>
              `;
            }).join('');

            // Only update innerHTML if it has changed significantly or is empty
            // To prevent flicker, we check if we actually have cards now
            if (content) {
                wbGrid.innerHTML = content;
            }
        } catch (err) {
            console.error("World Boss Render Error:", err);
        }
    }

    // --- Modal Control ---
    window.openIntelModal = function (entityName) {
        // Try to find in World Boss Data
        let entity = worldBossData?.find(b => b.name === entityName);
        let maps = [];

        if (entity) {
            maps = entity.maps;
        } else {
            // Try to find in Reflection Data
            entity = reflectionData?.find(r => r.name === entityName);
            if (entity) {
                maps = [{ name: entity.mapName, image: entity.mapImage }];
            }
        }

        if (!entity) return;

        const modal = document.getElementById('intel-modal');
        const nameEl = document.getElementById('modal-boss-name');
        const gridEl = document.getElementById('modal-map-container');

        nameEl.textContent = entity.name;
        gridEl.innerHTML = maps.map(m => `
          <div class="modal-map-item">
              <div class="modal-map-img" style="background-image: url('${m.image}')"></div>
              <div class="modal-map-name">${m.name}</div>
          </div>
      `).join('');

        modal.classList.add('active');
    };

    const closeModal = () => {
        document.getElementById('intel-modal').classList.remove('active');
    };

    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.getElementById('intel-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'intel-modal') closeModal();
    });

    function renderReflection() {
        const refGrid = document.getElementById('reflection-grid');
        if (!refGrid || typeof reflectionData === 'undefined') return;

        refGrid.innerHTML = reflectionData.map(ref => {
            const isSame = ref.magicStats === ref.physicalStats && ref.magicStats !== 'Unknown';
            const statsHtml = isSame ? `
                <div class="stat-box unified-stat">
                    <div class="stat-label">ALL RESISTANCE</div>
                    <div class="stat-val">${ref.magicStats}</div>
                </div>
            ` : `
                <div class="stat-box">
                    <div class="stat-label">MAGIC RES</div>
                    <div class="stat-val">${ref.magicStats}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">PHYSIC RES</div>
                    <div class="stat-val">${ref.physicalStats}</div>
                </div>
            `;

            return `
              <div class="intel-card animate-in" data-boss-name="${ref.name}">
                  <!-- Character Header -->
                  <div class="card-character-header">
                      <img src="${ref.image}" alt="${ref.name}">
                  </div>

                  <!-- Card Content -->
                  <div class="card-body">
                      <h3 class="card-title">${ref.name}</h3>
                      
                      <div class="stats-container">
                          ${statsHtml}
                      </div>

                      <button class="intel-action-btn" onclick="openIntelModal('${ref.name}')">
                          <i class="fa-solid fa-radar"></i> SHOW ON MAP
                      </button>
                  </div>
              </div>
          `;
        }).join('');
    }

    function renderBattlefield() {
        try {
            const bfTimeline = document.getElementById('battlefield-timeline');
            if (!bfTimeline || typeof battlefieldData === 'undefined') return;

            const sortedBattlefield = [...battlefieldData].sort((a, b) => {
                const msA = getNextSpawnMs([0, 1, 2, 3, 4, 5, 6].map(d => {
                     const [h, m] = a.time.split(':').map(Number);
                     return { day: d, h, m };
                }));
                const msB = getNextSpawnMs([0, 1, 2, 3, 4, 5, 6].map(d => {
                     const [h, m] = b.time.split(':').map(Number);
                     return { day: d, h, m };
                }));
                return msA - msB;
            });

            const content = sortedBattlefield.map((event, index) => {
                const [h, m] = event.time.split(':').map(Number);
                const schedules = [0, 1, 2, 3, 4, 5, 6].map(d => ({ day: d, h: h, m: m }));
                const scheduleJson = JSON.stringify(schedules).replace(/"/g, '&quot;');
                
                // Determine the correct icon
                const iconImg = event.mode === "Colosseum" ? "image/Crown-Colosseum.png" : "image/Crown-Battlefield.png";

                return `
                  <div class="intel-card bf-row-card animate-in" data-boss-name="${event.mode}">
                      <div class="card-body bf-row-body">
                          <div class="bf-info">
                              <img src="${iconImg}" class="bf-type-img" alt="${event.mode}">
                              <h3 class="card-title bf-title">${event.mode}</h3>
                          </div>
                          <div class="countdown-container bf-countdown">
                              <div class="countdown-tag bf-tag" data-schedules="${scheduleJson}">
                                  <img src="${iconImg}" class="bf-icon-sm" alt="icon">
                                  <span class="bf-label">COMING IN:</span>
                                  <span class="time-val">--:--:--</span>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
            }).join('');

            if (content) {
                bfTimeline.innerHTML = content;
            }
        } catch (err) {
            console.error("Battlefield Render Error:", err);
        }
    }

    // --- Master Loop (Consolidated Callbacks) ---
    // Combined: Clock + Countdown + Re-sort Logic + Daily Briefing Check
    let lastBriefingMinute = -1;
    const scheduleCache = new Map();

    function updateAllCountdowns(now) {
        document.querySelectorAll('.countdown-tag').forEach(el => {
            const schedulesStr = el.getAttribute('data-schedules');
            if (!schedulesStr) return;

            if (!scheduleCache.has(schedulesStr)) {
                scheduleCache.set(schedulesStr, JSON.parse(schedulesStr));
            }
            const schedules = scheduleCache.get(schedulesStr);
            const ms = getNextSpawnMs(schedules, now);
            if (ms < 0) return;

            const displaySpan = el.querySelector('.time-val');
            const wasActive = el.classList.contains('is-spawning');
            
            if (ms < 1000) {
                if (!wasActive) {
                    el.classList.add('is-spawning');
                    el.classList.remove('is-imminent');
                    if (el.classList.contains('bf-tag')) {
                        const iconImg = el.closest('.bf-row-card')?.getAttribute('data-boss-name') === "Colosseum" ? "image/Crown-Colosseum.png" : "image/Crown-Battlefield.png";
                        el.innerHTML = `<img src="${iconImg}" class="bf-icon-sm"> <span class="bf-label">STATUS:</span> <span class="time-val spawning-text">ACTIVE</span>`;
                    } else {
                        el.innerHTML = `<img src="image/monstertype.png" class="wb-status-icon"> STATUS: <span class="time-val spawning-text">ACTIVE</span>`;
                    }
                }
                return;
            }

            el.classList.remove('is-spawning');
            if (ms < 600000) el.classList.add('is-imminent'); // 10 minutes threshold
            else el.classList.remove('is-imminent');
            
            // If it was active but no longer is, we might need to restore the base HTML structure
            // Especially for Battlefield which expects a span.time-val
            if (wasActive && el.classList.contains('bf-tag')) {
                const iconImg = el.closest('.bf-row-card')?.getAttribute('data-boss-name') === "Colosseum" ? "image/Crown-Colosseum.png" : "image/Crown-Battlefield.png";
                el.innerHTML = `
                    <img src="${iconImg}" class="bf-icon-sm">
                    <span class="bf-label">COMING IN:</span>
                    <span class="time-val">--:--:--</span>
                `;
            }

            const s = Math.floor(ms / 1000);
            const hh = Math.floor(s / 3600).toString().padStart(2, '0');
            const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
            const ss = (s % 60).toString().padStart(2, '0');
            const timeStr = `${hh}:${mm}:${ss}`;

            // Re-query displaySpan if it was lost during innerHTML change
            const currentDisplaySpan = el.querySelector('.time-val');
            if (currentDisplaySpan) {
                currentDisplaySpan.textContent = timeStr;
            } else {
                // Restore structure if fully lost
                const iconImg = el.closest('.bf-row-card')?.getAttribute('data-boss-name') === "Colosseum" ? "image/Crown-Colosseum.png" : "image/Crown-Battlefield.png";
                if (el.classList.contains('bf-tag')) {
                    el.innerHTML = `<img src="${iconImg}" class="bf-icon-sm"> <span class="bf-label">COMING IN:</span> <span class="time-val">${timeStr}</span>`;
                } else {
                    el.innerHTML = `<img src="image/monstertype.png" class="wb-status-icon"> COMING IN: <span class="time-val">${timeStr}</span>`;
                }
            }
        });
    }

    function masterLoop() {
        const now = new Date();
        const currentMin = now.getMinutes();

        // 1. Update system clock
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }

        // 2. Daily Briefing check (once a minute)
        if (currentMin !== lastBriefingMinute) {
            renderDailyBriefing();
            lastBriefingMinute = currentMin;
        }

        // 3. Re-sort detection: Check if any ACTIVE event just ended
        let needsWBResort = false;
        let needsBFResort = false;

        document.querySelectorAll('.countdown-tag').forEach(el => {
            const schedulesStr = el.getAttribute('data-schedules');
            if (!schedulesStr) return;
            if (!scheduleCache.has(schedulesStr)) scheduleCache.set(schedulesStr, JSON.parse(schedulesStr));
            
            const schedules = scheduleCache.get(schedulesStr);
            const ms = getNextSpawnMs(schedules, now);
            
            // Resort if status changed (Started or Ended)
            const isSpawning = el.classList.contains('is-spawning');
            if ((isSpawning && ms >= 1000) || (!isSpawning && ms < 1000)) {
                if (el.classList.contains('bf-tag')) needsBFResort = true;
                else needsWBResort = true;
            }
        });

        // 4. Apply all countdown updates
        updateAllCountdowns(now);

        // 5. Handle re-sorts if needed
        if (needsWBResort) {
            scheduleCache.clear();
            renderWorldBoss();
            updateAllCountdowns(now); 
        }
        if (needsBFResort) {
            scheduleCache.clear();
            renderBattlefield();
            updateAllCountdowns(now);
        }
    }

    // --- Render Daily Briefing (BOSS TODAY with 07:00 reset) ---
    function renderDailyBriefing() {
        const briefingContainer = document.getElementById('daily-briefing-container');
        if (!briefingContainer || typeof worldBossData === 'undefined') return;

        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const serverDayDate = new Date(now);
        if (currentH < 7) serverDayDate.setDate(now.getDate() - 1);
        const serverDay = serverDayDate.getDay();

        const daysMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
        let todayBosses = [];

        function isDayInCycle(dayName, targetServerDay) {
            if (dayName === "Daily" || dayName === "Mon - Sun") return true;
            if (dayName.includes('-')) {
                const [start, end] = dayName.split('-').map(d => d.trim());
                const s = daysMap[start], e = daysMap[end];
                return s <= e ? (targetServerDay >= s && targetServerDay <= e) : (targetServerDay >= s || targetServerDay <= e);
            }
            return daysMap[dayName] === targetServerDay;
        }

        worldBossData.forEach(boss => {
            boss.times.forEach(timeStr => {
                let dayPart = "", hours = [];
                // isServerDayFormat: "DayRange: HH:MM ..." format (colon after day range)
                // In this format, ALL times belong to the specified server day cycle
                // e.g. "Fri - Sun: 16:03 22:03 04:03" → 04:03 is part of Fri/Sat/Sun server day
                let isServerDayFormat = false;

                if (timeStr.includes(':') && timeStr.split(':').length > 2) {
                    isServerDayFormat = true;
                    const colonIdx = timeStr.indexOf(':');
                    dayPart = timeStr.substring(0, colonIdx).trim();
                    hours = timeStr.substring(colonIdx + 1).trim().split(/\s+/);
                } else if (timeStr.includes('Daily') || timeStr.includes('Mon - Sun')) {
                    dayPart = "Daily";
                    hours = [timeStr.replace(/Daily|Mon\s*-\s*Sun/, '').trim()];
                } else {
                    const parts = timeStr.trim().split(/\s+/);
                    dayPart = parts[0];
                    hours = [parts[1]];
                }

                hours.forEach(hStr => {
                    const [bh, bm] = hStr.split(':').map(Number);

                    if (isServerDayFormat) {
                        // Server day format: all times belong to the same server day
                        if (isDayInCycle(dayPart, serverDay)) {
                            const sortKey = bh >= 7 ? bh * 60 + bm : (bh + 24) * 60 + bm;
                            todayBosses.push({ id: boss.id, name: boss.name, image: boss.images[0], time: hStr, h: bh, m: bm, sortKey, schedules: boss.times });
                        }
                    } else {
                        // Calendar day format: bh < 7 belongs to previous server day
                        if (isDayInCycle(dayPart, serverDay) && bh >= 7) {
                            todayBosses.push({ id: boss.id, name: boss.name, image: boss.images[0], time: hStr, h: bh, m: bm, sortKey: bh * 60 + bm, schedules: boss.times });
                        }
                        if (isDayInCycle(dayPart, (serverDay + 1) % 7) && bh < 7) {
                            todayBosses.push({ id: boss.id, name: boss.name, image: boss.images[0], time: hStr, h: bh, m: bm, sortKey: (bh + 24) * 60 + bm, schedules: boss.times });
                        }
                    }
                });
            });
        });

        todayBosses = todayBosses.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.time === v.time)) === i);
        todayBosses.sort((a, b) => a.sortKey - b.sortKey);

        if (todayBosses.length === 0) {
            briefingContainer.innerHTML = '';
            return;
        }

        briefingContainer.innerHTML = `<button class="briefing-btn" onclick="window.dispatchBriefingModal()"><i class="fa-solid fa-bolt"></i> DAILY INTEL</button>`;
        window.currentBriefingData = todayBosses;
    }

    // Modal Triggers
    window.dispatchBriefingModal = () => {
        const modal = document.getElementById('briefing-modal');
        const list = document.getElementById('briefing-modal-list');
        const data = window.currentBriefingData || [];
        if (!modal || !list) return;

        const now = new Date();
        list.innerHTML = data.map(boss => {
            const ms = getNextSpawnMs(getParsedSchedules(boss.schedules), now);
            let statusTag = '';
            
            if (ms <= 0) {
                statusTag = '<span class="briefing-status live">LIVE</span>';
            } else if (ms <= 600000) { // 10 mins
                statusTag = '<span class="briefing-status imminent">NEAR</span>';
            }

            return `
                <div class="briefing-row">
                    <div class="row-status">${statusTag}</div>
                    <div class="row-center">
                        <span class="row-name">${boss.name}</span>
                    </div>
                    <div class="row-right">
                        <div class="row-lcd-box">
                            <span class="row-time">${boss.time}</span>
                        </div>
                    </div>
                </div>`;
        }).join('');
        modal.classList.add('active');
    };

    const closeBriefingModal = () => document.getElementById('briefing-modal')?.classList.remove('active');
    document.getElementById('briefing-modal-close')?.addEventListener('click', closeBriefingModal);
    document.getElementById('briefing-modal')?.addEventListener('click', (e) => e.target.id === 'briefing-modal' && closeBriefingModal());

    // Start Single Master Loop
    setInterval(masterLoop, 1000);

    // Initial load
    renderWorldBoss();
    renderReflection();
    renderBattlefield();
    renderDailyBriefing();
    updateAllCountdowns(); // Apply values instantly on load

    // Default load: Trigger World Boss tab
    const defaultBtn = document.querySelector('.nav-btn[data-tab="worldboss"]');
    if (defaultBtn) defaultBtn.click();

    // Global Keyboard Listeners
    window.addEventListener('keydown', (e) => {
        // Global ESC key listener to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
    });

}, false);
