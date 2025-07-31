export function formatDate(dateString: string | Date) {
  try {
    let date: Date;
    
    // 处理不同的日期格式
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // 如果是ISO字符串或其他格式
      date = new Date(dateString);
    } else {
      // 如果是其他类型，尝试转换
      date = new Date(String(dateString));
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return '日期无效';
    }
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateString);
    return '日期格式错误';
  }
}
