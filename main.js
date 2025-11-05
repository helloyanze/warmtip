// 基础工具函数
const Utils = {
    // 随机数生成
    random: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  
    },
  
    
    // 随机颜色生成
    randomColor: function() {
      const colors = [
        'lightpink', 'skyblue', 'lightgreen', 'lavender',
        'lightyellow', 'plum', 'coral', 'bisque', 'aquamarine',
        'mistyrose', 'honeydew', 'lavenderblush', 'oldlace'
      ];
      return colors[this.random(0, colors.length - 1)];
    },
    
    // 温馨提示语
    tips: [' 多喝水哦～💧', ' 保持微笑呀😊', ' 每天都要元气满满✨',' 记得吃水果🍎', ' 保持好心情🥰', ' 好好爱自己❤️', ' 我想你了💌',' 梦想成真🌟', ' 期待下一次见面👋', ' 金榜题名📜',' 顺顺利利🚀', ' 早点休息🌙', ' 愿所有烦恼都消失☁️',' 别熬夜🌚', ' 今天过得开心嘛🥳', ' 天冷了，多穿衣服🧣',' 按时吃三餐呀🍚', ' 多晒晒太阳呀☀️', ' 记得好好护肤🧴',' 累了就歇歇呀😌', ' 万事皆顺意呀🍀', ' 平安喜乐常伴🙏',' 走路慢一点呀🚶', ' 别忘带雨伞呀☔', ' 每天多开心点😆',' 好运常围着你🍀', ' 记得补充能量⚡', ' 烦恼少一点呀🙅',' 常和朋友联系📞', ' 胃要好好呵护🍲', ' 今天也要加油💪',' 愿你被温柔待🤍', ' 雨天路滑小心🌧️', ' 多做喜欢的事🌈',' 别给自己施压😌', ' 笑口常开呀😄', ' 出门注意安全🚨',' 记得拉伸身体🧘', ' 生活闪闪发光💫', ' 愿你事事顺心✅',' 偶尔放松一下😌', ' 按时吃早餐呀🥐', ' 午睡别偷懒呀😴',' 快乐多一点呀🥳', ' 记得涂防晒呀🌞', ' 福气满满呀💰',' 别忘喝温水呀🥛', ' 日子甜滋滋呀🍬', ' 勇敢做自己呀💃',' 常回家看看呀🏠', ' 风大戴帽子呀🧢', ' 心情暖洋洋呀☀️'],
  
    
    // 随机提示
    randomTip: function() {
      return this.tips[this.random(0, this.tips.length - 1)];
  
    },
    
    // 防抖函数
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
};
  

// 主应用逻辑
class MysteryGiftApp {
    constructor() {
      this.isPlaying = false;
      this.popupCount = 0;
      this.maxPopups = 400;
      this.popupInterval = null;
      this.audio = document.getElementById('bgMusic');
      this.popupLayer = document.getElementById('popup-layer');
      this.floatBalls = document.getElementById('float-balls'); // 可能为null，使用时需要检查
      
      // 心形相关
      this.heartShapePoints = [];
      this.heartShapeIndex = 0;
      this.heartShapeCount = this.getHeartShapeCount(); // 根据屏幕大小设置气泡数量
      this.heartShapeCompleted = false;
      
      this.generateHeartShape();
      this.init();
    }
    
    // 根据屏幕大小获取心形气泡数量
    getHeartShapeCount() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        // 小屏手机
        return 30;
      } else if (screenWidth <= 768) {
        // 平板或大屏手机
        return 38;
      } else {
        // 桌面端
        return 50;
      }
    }
    
    // 获取气泡尺寸（根据屏幕大小自适应）
    getPopupSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        // 小屏手机
        return { width: 120, height: 50 };
      } else if (screenWidth <= 768) {
        // 平板或大屏手机
        return { width: 150, height: 60 };
      } else {
        // 桌面端
        return { width: 180, height: 70 };
      }
    }
    
    // 生成心形坐标点
    generateHeartShape() {
      const points = [];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // 获取气泡的实际尺寸（响应式）
      const popupSize = this.getPopupSize();
      const popupWidth = popupSize.width;
      const popupHeight = popupSize.height;
      
      // 心形参数方程：x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      // 在参数方程中，x的范围是-16到16（总宽度32），y的范围大约是-13到13（总高度约26）
      const heartParamWidth = 32; // 参数方程中的宽度
      const heartParamHeight = 26; // 参数方程中的高度（近似值）
      
      // 根据屏幕大小和气泡尺寸计算合适的缩放
      // 所有设备统一使用标准比例，不刻意拉长或压缩
      let scale;
      
      if (screenWidth <= 480) {
        // 小屏手机：允许超出屏幕，保持标准心形比例
        const availableWidth = screenWidth + popupWidth * 0.8; // 允许超出
        const availableHeight = screenHeight + popupHeight * 0.8;
        const scaleByWidth = availableWidth / heartParamWidth;
        const scaleByHeight = availableHeight / heartParamHeight;
        scale = Math.min(scaleByWidth, scaleByHeight) * 0.85;
      } else if (screenWidth <= 768) {
        // 平板：允许部分超出，标准比例
        const availableWidth = screenWidth + popupWidth * 0.6;
        const availableHeight = screenHeight + popupHeight * 0.6;
        const scaleByWidth = availableWidth / heartParamWidth;
        const scaleByHeight = availableHeight / heartParamHeight;
        scale = Math.min(scaleByWidth, scaleByHeight) * 0.85;
      } else {
        // 桌面端：标准比例，完全在屏幕内
        const availableWidth = screenWidth - popupWidth - 100;
        const availableHeight = screenHeight - popupHeight - 100;
        const maxSize = Math.min(availableWidth, availableHeight);
        scale = (maxSize / Math.max(heartParamWidth, heartParamHeight)) * 0.85;
      }
      
      // 居中显示
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      
      // 生成心形点（均匀分布，考虑气泡尺寸）
      for (let i = 0; i < this.heartShapeCount; i++) {
        const t = (i / this.heartShapeCount) * 2 * Math.PI;
        
        // 心形参数方程
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        
        // 应用统一缩放，保持心形标准比例
        x = x * scale;
        y = -y * scale; // 翻转Y轴使心形向上（因为屏幕坐标Y轴向下）
        
        // 计算气泡左上角坐标（使气泡中心对齐心形曲线点）
        let finalX = centerX + x - popupWidth / 2;
        let finalY = centerY + y - popupHeight / 2;
        
        // 移动端允许气泡部分超出屏幕以保证心形完整，桌面端严格限制
        if (screenWidth <= 768) {
          // 移动端：允许气泡部分超出（最多超出气泡宽度的40%）
          const allowOutX = popupWidth * 0.4;
          const allowOutY = popupHeight * 0.4;
          finalX = Math.max(-allowOutX, Math.min(finalX, screenWidth - popupWidth + allowOutX));
          finalY = Math.max(-allowOutY, Math.min(finalY, screenHeight - popupHeight + allowOutY));
        } else {
          // 桌面端：确保气泡完全在屏幕内
          finalX = Math.max(0, Math.min(finalX, screenWidth - popupWidth));
          finalY = Math.max(0, Math.min(finalY, screenHeight - popupHeight));
        }
        
        points.push({
          x: finalX,
          y: finalY
        });
      }
      
      this.heartShapePoints = points;
    }
    
    init() {
      this.bindEvents();
      this.setupAudio();
      // 页面加载后自动开始体验
      this.startExperience();
    }

    
    bindEvents() {
      // 窗口大小变化时重新布局和重新生成心形
      window.addEventListener('resize', Utils.debounce(() => {
        this.heartShapeCount = this.getHeartShapeCount();
        this.generateHeartShape();
        this.repositionPopups();
      }, 250));

    }
    
    setupAudio() {
      // 设置音频属性
      this.audio.volume = 0.8;
      this.audio.loop = true;
      
      // 音频加载完成事件
      this.audio.addEventListener('canplaythrough', () => {
  
        console.log('音频加载完成');
      });
      
      // 音频错误处理
      this.audio.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
      });
      
  
      // 音频结束事件（循环播放，无需处理）
    }
    
    startExperience() {
      this.isPlaying = true;

      // 显示浮动小球（如果存在）
      if (this.floatBalls) {
        this.floatBalls.style.display = 'flex';
      }
      
      // 开始播放音乐
      this.playMusic();
      
      // 开始弹窗
      this.startPopups();
    }
    
    playMusic() {
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('自动播放被阻止，需要用户交互');
          
          // 用户交互后播放
          const startOnInteraction = () => {
            this.audio.play().catch(e => {
              console.error('播放失败:', e);
            });
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
  
          };
          
          document.addEventListener('click', startOnInteraction, { once: true });
          document.addEventListener('keydown', startOnInteraction, { once: true });
        });
      }
    }
    
    startPopups() {
      // 立即创建第一个弹窗
      this.createPopup();
      
      // 设置定时器持续创建弹窗
      this.popupInterval = setInterval(() => {
  
        if (this.popupCount < this.maxPopups && this.isPlaying) {
          this.createPopup();
        } else {
          this.stopPopups();
          if (this.popupCount >= this.maxPopups) {
            // 达到最大值时，让所有气泡依次破裂
            this.burstAllPopups();
          }
        }
      }, 300);
    }
    
    createPopup() {
      if (this.popupCount >= this.maxPopups) return;
      
      const popup = document.createElement('div');
      popup.className = 'popup';
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // 获取气泡的实际尺寸（响应式）
      const popupSize = this.getPopupSize();
      const popupWidth = popupSize.width;
      const popupHeight = popupSize.height;
      
      let x, y;
      
      // 如果心形未完成，按心形排列
      if (!this.heartShapeCompleted && this.heartShapeIndex < this.heartShapePoints.length) {
        const point = this.heartShapePoints[this.heartShapeIndex];
        x = Math.max(0, Math.min(point.x, screenWidth - popupWidth));
        y = Math.max(0, Math.min(point.y, screenHeight - popupHeight));
        this.heartShapeIndex++;
        
        // 检查心形是否完成
        if (this.heartShapeIndex >= this.heartShapePoints.length) {
          this.heartShapeCompleted = true;
        }
      } else {
        // 心形完成后，随机位置
        x = Utils.random(0, screenWidth - popupWidth);
        y = Utils.random(0, screenHeight - popupHeight);
      }
      
      // 随机内容和颜色
      const tip = Utils.randomTip();
      const bgColor = Utils.randomColor();
      
      popup.style.left = x + 'px';
      popup.style.top = y + 'px';
      popup.style.backgroundColor = bgColor;
      
      popup.innerHTML = `
        <div class="popup-content">${tip}</div>
      `;
      
      // 点击移除
      popup.addEventListener('click', () => {
        this.removePopup(popup);
      });
      
      this.popupLayer.appendChild(popup);
      this.popupCount++;
      
      // 移除自动消失的定时器，弹窗将永久显示
    }
    
    removePopup(popup) {
      popup.style.animation = 'popupFadeOut 0.5s ease-out forwards';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
          this.popupCount--;

        }
      }, 500);
    }
    
    // 让气泡破裂（带有破裂动画）
    burstPopup(popup) {
      popup.style.animation = 'popupBurst 0.6s ease-out forwards';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
          this.popupCount--;
        }
      }, 600);
    }
    
    // 依次让所有气泡破裂
    burstAllPopups() {
      const popups = Array.from(document.querySelectorAll('.popup'));
      if (popups.length === 0) {
        // 如果没有气泡，直接重新开始
        this.resetAndRestart();
        return;
      }
      
      // 禁用所有气泡的点击事件，避免在破裂过程中被点击
      popups.forEach(popup => {
        popup.style.pointerEvents = 'none';
      });
      
      // 依次破裂，每个气泡间隔50毫秒
      popups.forEach((popup, index) => {
        setTimeout(() => {
          this.burstPopup(popup);
          
          // 最后一个气泡破裂后重新开始弹出气泡
          if (index === popups.length - 1) {
            setTimeout(() => {
              this.resetAndRestart();
            }, 600);
          }
        }, index * 50);
      });
    }
    
    // 重置并重新开始弹出气泡
    resetAndRestart() {
      // 重置计数器
      this.popupCount = 0;
      // 重置心形相关状态
      this.heartShapeIndex = 0;
      this.heartShapeCompleted = false;
      this.heartShapeCount = this.getHeartShapeCount();
      this.generateHeartShape(); // 重新生成心形（适应可能变化的窗口大小）
      // 重新开始弹出气泡
      this.startPopups();
    }
    
    // 不再需要重叠检测，允许弹窗叠加显示
    
    repositionPopups() {
      const popups = document.querySelectorAll('.popup');
      popups.forEach(popup => {
        const rect = popup.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
          // 重新定位超出边界的弹窗
  
          popup.style.left = Utils.random(0, window.innerWidth - rect.width) + 'px';
          popup.style.top = Utils.random(0, window.innerHeight - rect.height) + 'px';
        }
  
      });
    }
    
    stopPopups() {
      if (this.popupInterval) {
        clearInterval(this.popupInterval);
        this.popupInterval = null;
      }
    }
  
  }
  
  // 页面加载完成后初始化应用
  document.addEventListener('DOMContentLoaded', () => {
  
    new MysteryGiftApp();
  
  });
  
  // 添加弹窗淡出和破裂动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes popupFadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    @keyframes popupBurst {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.2) rotate(5deg);
      }
      100% {
        opacity: 0;
        transform: scale(0) rotate(180deg);
      }
    }
  `;
  document.head.appendChild(style);