class Detection {
  isPhone() {
    if (document.documentElement.classList.contains('phone')) {
      return true;
    } else return false;
  }

  isDesktop() {
    if (document.documentElement.classList.contains('desktop')) {
      return true;
    } else return false;
  }

  isTablet() {
    if (document.documentElement.classList.contains('tablet')) {
      return true;
    } else return false;
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
