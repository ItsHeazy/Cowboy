document.addEventListener("DOMContentLoaded", function(event) {
    // Select element
    const selectElement = (element) => document.querySelector(element);

    // Select button of the home page & navigate to the game page when the button is clicked
    selectElement('.start-page-btn').addEventListener('click', () => {
        selectElement('.start-page').classList.add('u-hidden');
        selectElement('.game-page').classList.remove('u-hidden');
    });

    // Select button to quit the game & navigate to the home page when the button is clicked
    selectElement('.quit-game').addEventListener('click', () => {
        selectElement('.congrats-page').classList.add('u-hidden');
        selectElement('.start-page').classList.remove('u-hidden');
    });

});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBTZWxlY3QgZWxlbWVudFxuICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSAoZWxlbWVudCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KTtcblxuICAgIC8vIFNlbGVjdCBidXR0b24gb2YgdGhlIGhvbWUgcGFnZSAmIG5hdmlnYXRlIHRvIHRoZSBnYW1lIHBhZ2Ugd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICBzZWxlY3RFbGVtZW50KCcuc3RhcnQtcGFnZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgc2VsZWN0RWxlbWVudCgnLnN0YXJ0LXBhZ2UnKS5jbGFzc0xpc3QuYWRkKCd1LWhpZGRlbicpO1xuICAgICAgICBzZWxlY3RFbGVtZW50KCcuZ2FtZS1wYWdlJykuY2xhc3NMaXN0LnJlbW92ZSgndS1oaWRkZW4nKTtcbiAgICB9KTtcblxuICAgIC8vIFNlbGVjdCBidXR0b24gdG8gcXVpdCB0aGUgZ2FtZSAmIG5hdmlnYXRlIHRvIHRoZSBob21lIHBhZ2Ugd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICBzZWxlY3RFbGVtZW50KCcucXVpdC1nYW1lJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHNlbGVjdEVsZW1lbnQoJy5jb25ncmF0cy1wYWdlJykuY2xhc3NMaXN0LmFkZCgndS1oaWRkZW4nKTtcbiAgICAgICAgc2VsZWN0RWxlbWVudCgnLnN0YXJ0LXBhZ2UnKS5jbGFzc0xpc3QucmVtb3ZlKCd1LWhpZGRlbicpO1xuICAgIH0pO1xuXG4gICAgLy8gV2hlbiBcImVzcXVpdmUgw6AgZ2F1Y2hlXCIgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICBzZWxlY3RFbGVtZW50KCcuYnRuLXAyLXAxJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7Y29uc29sZS5sb2coJ0VzcXVpdmUgw6AgZ2F1Y2hlJyk7fSk7XG5cbiAgICAvLyBXaGVuIFwiZXNxdWl2ZSDDoCBkcm9pdGVcIiBidXR0b24gaXMgY2xpY2tlZFxuICAgIHNlbGVjdEVsZW1lbnQoJy5idG4tcDItcDInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtjb25zb2xlLmxvZygnRXNxdWl2ZSDDoCBkcm9pdGUnKTt9KTtcblxuICAgIC8vIFdoZW4gXCJ0aXJlclwiIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgc2VsZWN0RWxlbWVudCgnLmJ0bi1wMi1wMycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge2NvbnNvbGUubG9nKCdUaXJlcicpO30pO1xuXG5cbn0pO1xuIl0sImZpbGUiOiJzY3JpcHQuanMifQ==
