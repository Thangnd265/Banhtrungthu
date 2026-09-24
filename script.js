/**
 * ============================================================================
 * TRANG WEB CHÚC MỪNG TRUNG THU NGƯỜI YÊU (MOBILE FIRST)
 * Kịch bản chuyển động liên tục: Lời chúc -> Chuỗi ảnh kỷ niệm -> Vòng lặp vô tận
 * ============================================================================
 */

// ==========================================
// 1. CẤU HÌNH TÙY BIẾN DỄ DÀNG (CONFIG)
// ==========================================
const CONFIG = {
  // Tên hiển thị người yêu
  recipientName: "Bé Yêu Của Anh 💕",

  // Lời chúc mở đầu (hỗ trợ xuống dòng bằng \n)
  openingGreeting: "Chúc em một mùa Tết Trung Thu thật ấm áp, ngọt ngào và tràn ngập niềm vui! 🌕✨\n\nCảm ơn em vì đã đến bên anh, làm cho cuộc sống này trở nên lung linh và dịu êm như ánh trăng rằm.\n\nTrăng ngoài kia có lúc tròn lúc khuyết, nhưng yêu thương anh dành cho em thì luôn tròn đầy mãi mãi! 💖🏮",

  // Danh sách ảnh kỷ niệm & lời nhắn tương ứng (chạy liên tục thành vòng lặp)
  photos: [
    {
      url: "images/sample1.jpg",
      caption: "Vầng trăng đêm nay đẹp... nhưng không bằng nụ cười của em 🌙",
      date: "Đêm Rằm Tháng 8"
    },
    {
      url: "images/sample2.jpg",
      caption: "Nguyện ước dưới ánh đèn lồng: Luôn có em bên đời 🏮✨",
      date: "Hội An Hoài Niệm"
    },
    {
      url: "images/sample3.jpg",
      caption: "Mỗi khoảnh khắc bên em đều là kỷ niệm vô giá 💖",
      date: "Mùa Trăng Yêu Thương"
    },
    {
      url: "images/sample4.jpg",
      caption: "Yêu em nhiều hơn cả ngàn vì sao trên bầu trời đêm ✨🥰",
      date: "Forever With You"
    }
  ],

  // Đường dẫn nhạc nền lãng mạn mặc định
  musicUrl: "audio/mid-autumn-love.mp3",

  // Thời gian hiển thị mỗi bức ảnh (mili-giây)
  photoDuration: 4500,

  // Thời gian dừng đọc lời chúc sau khi gõ xong (mili-giây) trước khi chuyển sang xem ảnh
  greetingHoldTime: 2200
};

// ==========================================
// 1.1 TỰ ĐỘNG ĐỌC CẤU HÌNH TỪ NOIDUNG.TXT & THƯ MỤC ANH/
// ==========================================
async function loadConfigFromTxt() {
  try {
    const res = await fetch('noidung.txt');
    if (res.ok) {
      const text = await res.text();
      parseNoidungTxt(text);
    }
  } catch (err) {
    // Chế độ fallback nếu mở file cục bộ bị chặn fetch
    console.log('Using default CONFIG (local/fallback mode)');
  }

  // Tự động kiểm tra và nạp ảnh từ thư mục anh/
  await detectPhotosInAnhFolder();
}

let savedTxtCaptions = [];

function parseNoidungTxt(text) {
  const sections = {};
  let currentSection = null;

  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || (!trimmed && !currentSection)) continue;

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1);
      sections[currentSection] = [];
    } else if (currentSection && trimmed) {
      sections[currentSection].push(line);
    }
  }

  if (sections['TEN_NGUOI_YEU'] && sections['TEN_NGUOI_YEU'].length > 0) {
    const name = sections['TEN_NGUOI_YEU'].join(' ').trim();
    if (name) CONFIG.recipientName = name;
  }

  if (sections['LOI_CHUC_MO_DAU'] && sections['LOI_CHUC_MO_DAU'].length > 0) {
    const greeting = sections['LOI_CHUC_MO_DAU'].join('\n').trim();
    if (greeting) CONFIG.openingGreeting = greeting;
  }

  if (sections['LOI_NHAN_DEN_TROI'] && sections['LOI_NHAN_DEN_TROI'].length > 0) {
    savedTxtCaptions = sections['LOI_NHAN_DEN_TROI'].map(c => c.trim()).filter(Boolean);
    if (savedTxtCaptions.length > 0) {
      savedTxtCaptions.forEach((cap, idx) => {
        if (CONFIG.photos[idx]) {
          CONFIG.photos[idx].caption = cap;
        }
      });
    }
  }
}

async function detectPhotosInAnhFolder() {
  const defaultCaptions = [
    "Vầng trăng đêm nay đẹp... nhưng không bằng nụ cười của em 🌙",
    "Nguyện ước dưới ánh đèn lồng: Luôn có em bên đời 🏮✨",
    "Mỗi khoảnh khắc bên em đều là kỷ niệm vô giá 💖",
    "Yêu em nhiều hơn cả ngàn vì sao trên bầu trời đêm ✨🥰",
    "Bên em mỗi ngày đều là một mùa trăng hạnh phúc 🌕",
    "Hẹn ước cùng em đi qua thật nhiều mùa Trung Thu nữa nhé! ❤️"
  ];
  const activeCaptions = savedTxtCaptions.length > 0 ? savedTxtCaptions : defaultCaptions;

  // Thử kiểm tra ảnh từ anh/1 đến anh/50 (hỗ trợ .jpg, .png, .jpeg, .webp)
  const exts = ['jpg', 'png', 'jpeg', 'webp'];
  const testPromises = [];
  for (let i = 1; i <= 50; i++) {
    testPromises.push(
      new Promise((resolve) => {
        let extIdx = 0;
        function tryNext() {
          if (extIdx >= exts.length) return resolve(null);
          const ext = exts[extIdx++];
          const img = new Image();
          const url = `anh/${i}.${ext}`;
          img.onload = () => resolve({ url, index: i });
          img.onerror = () => tryNext();
          img.src = url;
        }
        tryNext();
      })
    );
  }

  const results = await Promise.all(testPromises);
  const validPhotos = results.filter(Boolean);

  if (validPhotos.length > 0) {
    validPhotos.sort((a, b) => a.index - b.index);
    CONFIG.photos = validPhotos.map((item, idx) => {
      const caption = activeCaptions[idx % activeCaptions.length];
      return {
        url: item.url,
        caption: caption,
        date: "Đêm Rằm Tháng 8"
      };
    });
  }
}
function initSkyCanvas() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Tạo các vì sao
  const starCount = 65;
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.7),
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005,
    direction: Math.random() > 0.5 ? 1 : -1
  }));

  // Tạo đom đóm vàng lượn quanh
  const fireflyCount = 20;
  const fireflies = Array.from({ length: fireflyCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1.2,
    alpha: Math.random() * 0.8 + 0.2,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    pulseSpeed: Math.random() * 0.03 + 0.01
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Vẽ sao nhấp nháy
    stars.forEach(star => {
      star.alpha += star.speed * star.direction;
      if (star.alpha <= 0.1) {
        star.alpha = 0.1;
        star.direction = 1;
      } else if (star.alpha >= 0.95) {
        star.alpha = 0.95;
        star.direction = -1;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 210, ${star.alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#fff2b2';
      ctx.fill();
    });

    // Vẽ đom đóm
    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      f.alpha += Math.sin(Date.now() * 0.002 * f.pulseSpeed) * 0.02;
      f.alpha = Math.max(0.15, Math.min(0.9, f.alpha));

      if (f.x < 0) f.x = width;
      if (f.x > width) f.x = 0;
      if (f.y < 0) f.y = height;
      if (f.y > height) f.y = 0;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${f.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd700';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 3. THẢ ĐÈN LỒNG HỘI AN LƠ LỬNG
// ==========================================
function initLanterns() {
  const container = document.getElementById('lanterns-container');
  if (!container) return;

  const maxLanterns = 14;
  let activeLanterns = 0;

  function spawnLantern() {
    if (activeLanterns >= maxLanterns) return;

    const lantern = document.createElement('div');
    lantern.className = 'lantern';

    // Kích thước & thời gian ngẫu nhiên
    const scale = (Math.random() * 0.5 + 0.65).toFixed(2);
    const duration = (Math.random() * 8 + 12).toFixed(1); // 12s - 20s
    const leftPercent = Math.random() * 92 + 4; // 4% - 96%
    const driftX = (Math.random() * 60 - 30).toFixed(0); // Lắc lư ngang

    lantern.style.setProperty('--scale', scale);
    lantern.style.setProperty('--drift-x', `${driftX}px`);
    lantern.style.left = `${leftPercent}%`;
    lantern.style.animationDuration = `${duration}s`;

    lantern.innerHTML = `
      <div class="lantern-body">
        <div class="lantern-rib"></div>
        <div class="lantern-tassel"></div>
      </div>
    `;

    container.appendChild(lantern);
    activeLanterns++;

    // Dọn dẹp DOM khi bay hết màn hình bằng animationend
    const cleanLantern = () => {
      lantern.remove();
      activeLanterns--;
    };
    lantern.addEventListener('animationend', cleanLantern, { once: true });
    setTimeout(cleanLantern, (parseFloat(duration) + 1) * 1000); // dự phòng
  }

  // Tạo ban đầu
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnLantern, i * 1500);
  }

  // Định kỳ thả tiếp liên tục
  setInterval(spawnLantern, 2200);
}

// ==========================================
// 4. HIỆU ỨNG GÕ CHỮ LỜI CHÚC (STAGE 1) VỚI SAO LẤP LÁNH CUỐI CHỮ
// ==========================================
function createTypewriterSparkle(targetEl) {
  if (!targetEl) return;
  const sparkle = document.createElement('span');
  sparkle.className = 'typewriter-floating-sparkle';
  const symbols = ['✦', '✨', '⋆'];
  sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  const offsetX = (Math.random() * 12 - 6).toFixed(0);
  const offsetY = (Math.random() * 8 - 4).toFixed(0);
  sparkle.style.setProperty('--sparkle-ox', `${offsetX}px`);
  sparkle.style.setProperty('--sparkle-oy', `${offsetY}px`);
  targetEl.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 550);
}

function playTypewriterGreeting(onComplete) {
  const titleEl = document.getElementById('recipient-title');
  const greetingEl = document.getElementById('greeting-text');

  if (titleEl) {
    titleEl.textContent = CONFIG.recipientName;
  }

  if (!greetingEl) {
    if (onComplete) onComplete();
    return;
  }

  const fullText = (CONFIG.openingGreeting || "").trim();
  let index = 0;
  greetingEl.innerHTML = '<span class="greeting-text-flow"><span class="typewriter-text-body"></span><span class="typewriter-star-cursor"><span class="star-sparkle-core">✦</span></span></span>';
  const textBody = greetingEl.querySelector('.typewriter-text-body');
  const cursor = greetingEl.querySelector('.typewriter-star-cursor');

  function typeChar() {
    if (index < fullText.length) {
      const char = fullText[index];
      textBody.textContent += char;
      index++;

      // Tỏa bụi sao lấp lánh nhẹ nhàng ở cuối chỗ chữ hiện lên dần (không tạo khi gặp dấu cách hay xuống dòng)
      if (index % 4 === 0 && char !== ' ' && char !== '\n') {
        createTypewriterSparkle(cursor);
      }

      // Tốc độ gõ chữ chậm lại một chút theo yêu cầu (ấm áp, tự nhiên, sâu lắng)
      let delay = 42;
      if (char === '.' || char === '!' || char === '?') delay = 200;
      else if (char === ',' || char === '\n') delay = 120;
      else if (char === ' ') delay = 50;

      setTimeout(typeChar, delay);
    } else {
      // Đã gõ xong toàn bộ: giữ sao sáng lung linh
      if (cursor) cursor.classList.add('done');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, CONFIG.greetingHoldTime);
    }
  }

  // Khởi động gõ chữ sau 400ms
  setTimeout(typeChar, 400);
}

// ==========================================
// 5. CHUỖI ĐÈN TRỜI KỶ NIỆM VỚI HỆ THỐNG PHÂN LÀN CHỐNG ĐÈ LẤN (STAGE 2)
// ==========================================
let floatingPhotoTimer = null;
let photoStreamIndex = 0;
let activeFloatingPhotos = 0;
let isAnimating = false;

// Giới hạn số lượng đèn bay đồng thời để bầu trời thoáng đãng, thơ mộng (không có khoảng trống)
const MAX_CONCURRENT_FLOATING_PHOTOS = 6;

// Hệ thống 2 luồng bay rộng Trái - Phải độc lập so le chống đè lấn
const LANES = [
  { minLeft: 6,  maxLeft: 14, name: 'left' },
  { minLeft: 50, maxLeft: 58, name: 'right' }
];
let currentLaneIndex = 0;

// Các tầng độ sâu xa - gần (đồng bộ hóa thời gian bay 12s - 17s để không đuổi kịp nhau)
const DEPTH_LEVELS = [
  {
    className: 'photo-depth-far',
    durationRange: [15, 17],
    targetOpacity: 0.72
  },
  {
    className: 'photo-depth-mid',
    durationRange: [13, 15],
    targetOpacity: 0.9
  },
  {
    className: 'photo-depth-near',
    durationRange: [12, 14],
    targetOpacity: 1.0
  }
];

function startFloatingPhotos() {
  const greetingStage = document.getElementById('greeting-stage');
  const galleryStage = document.getElementById('gallery-stage');
  const container = document.getElementById('floating-photos-container');

  if (!galleryStage || !CONFIG.photos || CONFIG.photos.length === 0) return;

  // Chuyển đổi stage êm dịu
  if (greetingStage) {
    greetingStage.classList.remove('active');
  }
  galleryStage.classList.add('active');

  // Cài đặt sự kiện đóng modal ảnh khi chạm
  setupPhotoModal();

  // Thả các đèn ban đầu so le mượt mà để bầu trời lập tức có đèn lượn bay (không có khoảng trống)
  setTimeout(spawnFloatingPhoto, 300);
  setTimeout(spawnFloatingPhoto, 1600);
  setTimeout(spawnFloatingPhoto, 3000);

  // Định kỳ thả liên tục mỗi 2.6s (vừa vặn, liên tục, không bị dày đặc)
  if (floatingPhotoTimer) clearInterval(floatingPhotoTimer);
  floatingPhotoTimer = setInterval(spawnFloatingPhoto, 2600);
}

// Hàm tương thích ngược với kịch bản cũ
function startPhotoShowcase() {
  startFloatingPhotos();
}

function showPhoto(index = 0) {
  if (isAnimating) return;
  isAnimating = true;
  const currentPhotoImg = document.getElementById('current-photo');
  if (currentPhotoImg && CONFIG.photos && CONFIG.photos.length > 0) {
    currentPhotoImg.onerror = null;
    currentPhotoImg.src = CONFIG.photos[index % CONFIG.photos.length].url;
  }
  setTimeout(() => { isAnimating = false; }, 500);
}

function spawnFloatingPhoto() {
  const container = document.getElementById('floating-photos-container');
  if (!container || activeFloatingPhotos >= MAX_CONCURRENT_FLOATING_PHOTOS) return;

  // Lấy dữ liệu ảnh tuần tự trong danh sách CONFIG
  const total = CONFIG.photos.length;
  const photoData = CONFIG.photos[photoStreamIndex % total];
  photoStreamIndex++;

  // Chọn làn bay theo thứ tự xoay vòng (Trái -> Phải) để không bao giờ đè lên nhau
  const lane = LANES[currentLaneIndex % LANES.length];
  currentLaneIndex++;
  const leftPercent = (Math.random() * (lane.maxLeft - lane.minLeft) + lane.minLeft).toFixed(1);

  // Chọn ngẫu nhiên tầng độ sâu (Xa, Trung, Gần)
  // Tỷ lệ: 40% Xa, 35% Trung, 25% Gần
  const rand = Math.random();
  let depth = DEPTH_LEVELS[1]; // mặc định tầng trung
  if (rand < 0.4) depth = DEPTH_LEVELS[0]; // xa
  else if (rand > 0.75) depth = DEPTH_LEVELS[2]; // gần

  const card = document.createElement('div');
  // Áp dụng template đèn trời sky-lantern kèm touch-target mở rộng vùng chạm
  card.className = `floating-photo sky-lantern touch-target ${depth.className}`;

  // Tính toán thời gian bay, độ lệch ngang nhẹ và góc nghiêng thẳng tự nhiên (-2deg đến +2deg)
  const [minDur, maxDur] = depth.durationRange;
  const duration = (Math.random() * (maxDur - minDur) + minDur).toFixed(1);
  const driftX = (Math.random() * 20 - 10).toFixed(0);
  const rot = (Math.random() * 4 - 2).toFixed(1);

  card.style.left = `${leftPercent}%`;
  card.style.animationDuration = `${duration}s`;
  card.style.setProperty('--rot', `${rot}deg`);
  card.style.setProperty('--drift-x', `${driftX}px`);
  card.style.setProperty('--target-opacity', depth.targetOpacity);

  card.innerHTML = `
    <div class="floating-photo-img-box">
      <img src="${photoData.url}" alt="${photoData.caption}" loading="lazy">
    </div>
    <div class="floating-photo-meta">
      <p class="floating-photo-caption">${photoData.caption}</p>
      <span class="floating-photo-date">${photoData.date}</span>
    </div>
    <div class="lantern-rim"></div>
    <div class="lantern-flame"></div>
    <div class="floating-photo-tassel"></div>
  `;

  // Xử lý fallback ảnh lỗi an toàn
  const imgEl = card.querySelector('img');
  if (imgEl) {
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = 'images/sample1.jpg';
    };
  }

  // Hỗ trợ cả chạm di động (touchend) và click chuột để mở xem chi tiết
  let lastTapTime = 0;
  const handleOpen = (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapTime < 350) return; // Debounce chống tap đúp
    lastTapTime = now;
    openPhotoModal(photoData);
  };

  card.addEventListener('click', handleOpen);
  card.addEventListener('touchend', handleOpen, { passive: true });

  container.appendChild(card);
  activeFloatingPhotos++;

  // Dọn dẹp DOM khi ảnh đã bay hết khỏi màn hình (chống trừ 2 lần)
  let cleaned = false;
  const cleanCard = () => {
    if (cleaned) return;
    cleaned = true;
    card.remove();
    activeFloatingPhotos = Math.max(0, activeFloatingPhotos - 1);
  };
  card.addEventListener('animationend', cleanCard, { once: true });
  setTimeout(cleanCard, (parseFloat(duration) + 1) * 1000); // dự phòng
}

// Cài đặt modal xem ảnh phóng to
function setupPhotoModal() {
  const modal = document.getElementById('photo-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePhotoModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePhotoModal();
    }
  });
}

function openPhotoModal(photoData) {
  const modal = document.getElementById('photo-modal');
  const imgEl = document.getElementById('current-photo');
  const captionEl = document.getElementById('photo-caption');
  const dateEl = document.getElementById('photo-date');

  if (!modal) return;

  if (imgEl) {
    imgEl.src = photoData.url;
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = 'images/sample1.jpg';
    };
  }
  if (captionEl) captionEl.textContent = photoData.caption;
  if (dateEl) dateEl.textContent = photoData.date;

  modal.classList.add('active');
}

function closePhotoModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) modal.classList.remove('active');
}

// ==========================================
// 6. TỰ ĐỘNG PHÁT NHẠC THÔNG MINH (AUDIO)
// ==========================================
function setupAudioAutoplay() {
  const audio = document.getElementById('bgm-audio');
  const musicBtn = document.getElementById('music-btn');

  if (!audio || !musicBtn) return;

  audio.src = CONFIG.musicUrl;

  let isPlaying = false;

  const playMusic = () => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          musicBtn.classList.add('active');
        })
        .catch(() => {
          // Bị trình duyệt chặn autoplay
          isPlaying = false;
          musicBtn.classList.remove('active');
        });
    }
  };

  const pauseMusic = () => {
    audio.pause();
    isPlaying = false;
    musicBtn.classList.remove('active');
  };

  // Nút điều khiển bật / tắt thủ công
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Tự động thử phát ngay lập tức
  playMusic();

  // Cơ chế giải mã autoplay policy trên iOS Safari & Android Chrome:
  // Chạm vào bất kỳ vị trí nào trên màn hình lần đầu sẽ lập tức kích hoạt nhạc
  const unlockAudio = () => {
    if (!isPlaying) {
      playMusic();
    }
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };

  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
  window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
  window.addEventListener('click', unlockAudio, { once: true });
}

// ==========================================
// 7. KHỞI CHẠY KỊCH BẢN CHÍNH
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Tự động đọc cấu hình từ noidung.txt và thư mục anh/
  await loadConfigFromTxt();

  // 2. Vẽ nền sao và đom đóm
  initSkyCanvas();

  // 3. Thả đèn lồng Hội An
  initLanterns();

  // 4. Tự động bật nhạc
  setupAudioAutoplay();

  // 5. Bắt đầu gõ lời chúc -> sau đó tự động chuyển sang thả đèn trời kỷ niệm
  playTypewriterGreeting(() => {
    startPhotoShowcase();
  });
});
