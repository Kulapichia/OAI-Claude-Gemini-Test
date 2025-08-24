import { useState, useCallback, useEffect } from 'react';

export const useVirtualization = () => {
  const [listHeight, setListHeight] = useState(350);

  // 动态计算项目高度 - 更精确的计算
  const getItemHeight = useCallback((keyData) => {
    // 基础高度：padding(12*2=24) + wrapper padding(4*2=8) + 基础内容(40) = 72px
    let baseHeight = 72;
    
    // 每行额外内容的高度
    const lineHeight = 16;
    
    // 如果有模型信息，增加一行
    if (keyData && keyData.model) {
      baseHeight += lineHeight;
    }
    
    // 如果有错误信息，增加一行
    if (keyData && keyData.error) {
      baseHeight += lineHeight;
    }
    
    // 如果有重试信息，增加一行
    if (keyData && keyData.retryCount > 0) {
      baseHeight += lineHeight;
    }
    
    return baseHeight;
  }, []);

  const getListHeight = useCallback(() => {
    // 根据屏幕大小动态调整列表高度
    if (typeof window !== 'undefined') {
      const screenHeight = window.innerHeight;
      if (screenHeight <= 768) {
        return 300; // 移动端
      } else if (screenHeight <= 1024) {
        return 350; // 平板
      } else {
        return 400; // 桌面端
      }
    }
    return 350;
  }, []);

  const updateListHeight = useCallback(() => {
    const newHeight = getListHeight();
    setListHeight(newHeight);
  }, [getListHeight]);

  useEffect(() => {
    updateListHeight();
    let orientationTimeout;

    const handleResize = () => {
      updateListHeight();
    };

    const handleOrientationChange = () => {
      orientationTimeout = setTimeout(updateListHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (orientationTimeout) {
        clearTimeout(orientationTimeout);
      }
    };
  }, [updateListHeight]);

  return {
    listHeight,
    getItemHeight,
    getListHeight: () => listHeight
  };
};
