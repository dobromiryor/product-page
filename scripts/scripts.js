let navHidden = true;
let cartEmpty = true;
let photoUrl = './assets/photos/0.jpg';
let photoSize = window.innerWidth - 32;
let recommendationsLoaded = false;
let selectedColor = '550 - Black';
let selectedId = '0';
let hoveredColor = '';
let quantity = 0;
let galleryImage = photoUrl;
let onlyNumbers = /\D+/g;

const initialize = () => {
  // Last Crumb
  document.getElementById('crumb-name').innerText = data.item.name

  // Product Photos

  // Big screen
  data.item.photos.forEach((url, index) => {
    document.getElementById('product-photos-big').innerHTML += `
      <div class='product-photo-big-container'>
        <div
          photo='${index}'
          class='product-photo-big'
          style='background-image: url(${url});'
          onClick='openGallery(this)'
        ><div/>
      <div/>
    `
  })

  // Mobile
  // Main Photo
  document.getElementById('main-photo').setAttribute('style', `background-image: url(${photoUrl})`)
  document.getElementById('main-photo').setAttribute('photo', `0`)

  // Main Photo grid
  data.item.photos.forEach((url, index) => {
    document.getElementById('main-photo-grid').innerHTML += `
      <div
        class='photo-thumb'
        thumb='${index}'
        style='background-image: url(${url});'
        onclick='handleThumbClick(this)'
      ></div>
    `
  })

  // Description
  document.getElementById('product-name').innerText = data.item.name
  document.getElementById('product-description').innerText = data.item.description

  // Color options
  data.item.colors.forEach((color, index) => {
    Object.entries(color).forEach(([key, value]) => {
      if (key === 'photo') {
        document.getElementById('product-color-options').innerHTML += `
          <img
            class='product-color-option'
            colorIndex='${index}'
            src='${value}'
            onclick='handleColorSelect(this)'
            onmouseover='handleColorHover(this)'
            onmouseout='displaySelectedColor()'
          />
        `
      }
    })
  })
  document.getElementById('product-color-name').innerText = selectedColor
  document.getElementById('product-color-name').classList.add('selected')

  // Price
  let oldPrice = data.item.oldPrice.split('.')
  let price = data.item.price.split('.')
  document.getElementById('product-old-price-value').innerText = oldPrice[0]
  document.getElementById('product-old-price-value-decimal').innerText = oldPrice[1]
  document.getElementById('product-price-value').innerText = price[0]
  document.getElementById('product-price-value-decimal').innerText = price[1]
  document.getElementById('product-old-price-currency').innerText = data.item.currency
  document.getElementById('product-price-currency').innerText = data.item.currency

  // Table
  let specifications = data.item.specifications
  Object.entries(specifications).forEach(([key, value]) => {
    document.getElementById('specifications').innerHTML += `<tr><td>${key}</td><td>${value}</td></tr>`
  })
  document.getElementById('specifications').className = 'active'

  // Gallery Keyboard Controls
  document.addEventListener('keyup', event => {
    if (document.getElementById('gallery').hasAttribute('class', 'hidden')) {
      if (event.code === 'Escape') {
        closeGallery()
      } else if (event.code === 'ArrowLeft') {
        previousGalleryImage()
      } else if (event.code === 'ArrowRight') {
        nextGalleryImage()
      }
    }
  })

  // Gallery Swipe Controls
  let touchStartX = null
  let touchStartY = null

  const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  const handleTouchMove = (event) => {
    if (!touchStartX || !touchStartY) {
      return
    }

    let touchEndX = event.touches[0].clientX
    let touchEndY = event.touches[0].clientY

    let movedX = touchStartX - touchEndX
    let movedY = touchStartY - touchEndY

    if (Math.abs(movedX) > Math.abs(movedY)) {
      if (movedX > 0) {
        previousGalleryImage()
      } else {
        nextGalleryImage()
      }
    } else {
      if (movedY > 0) {
        // closeGallery()
      } else {
        // closeGallery()
      }
    }
    touchStartX = null;
    touchStartY = null;
  }

  document.getElementById('gallery').addEventListener('touchstart', handleTouchStart, false)
  document.getElementById('gallery').addEventListener('touchmove', handleTouchMove, false)
}

const getRecommendations = () => {
  data.recommendations.forEach((item, index) => {
    document.getElementById('recommendation-container').innerHTML += `
      <div id='recommendation-${index}' class='recommendation'></div>
    `
    Object.entries(item).forEach(([key, value]) => {
      if (key === 'photo') {
        document.getElementById(`recommendation-${index}`).innerHTML += `
        <div class='recommendation-image' style='background-image: url(${value}')></div>
        `
      } else if (key === 'name') {
        document.getElementById(`recommendation-${index}`).innerHTML += `
        <span class='recommendation-name'>${value}</span>
        `
      } else if (key === 'oldPrice') {
        if (value === '0') {
          document.getElementById(`recommendation-${index}`).innerHTML += `
            <span class='recommendation-old-price'></span>
          `
        } else {
          document.getElementById(`recommendation-${index}`).innerHTML += `
            <span class='recommendation-old-price'>${value}</span>
          `
        }
      } else if (key === 'price') {
        document.getElementById(`recommendation-${index}`).innerHTML += `
        <span class='recommendation-price'>${value}</span>
        `
      }
    })
  })
}

const toggleNav = () => {
  if (navHidden) {
    navHidden = false;
    document.getElementById('header-nav').classList.remove('nav-hidden')
    document.getElementById('menu-button').classList.replace('fa-bars', 'fa-angle-left')
    document.body.classList.add('of-hidden')
  } else {
    navHidden = true
    document.getElementById('header-nav').classList.add('nav-hidden')
    document.getElementById('menu-button').classList.replace('fa-angle-left', 'fa-bars')
    document.body.classList.remove('of-hidden')
  }
}

const handleCartMouseOver = () => {
  if (!cartEmpty) {
    document.getElementById('confirmation-message-container').classList.remove('hidden')
  }
}
const handleCartMouseOut = () => {
  if (!cartEmpty) {
    document.getElementById('confirmation-message-container').classList.add('hidden')
  }
}

const handleThumbClick = (obj) => {
  let name = (obj.attributes.thumb.value)
  photoUrl = `./assets/photos/${name}.jpg`
  document.getElementById('main-photo').setAttribute('style', `
    background-image: url(${photoUrl});
  `)
  document.getElementById('main-photo').setAttribute('photo', `${name}`)

}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    document.getElementById('product-photos-big').classList.remove('none')
    document.getElementById('product-photos').classList.add('none')
  } else {
    document.getElementById('product-photos-big').classList.add('none')
    document.getElementById('product-photos').classList.remove('none')
  }
}

const handleColorSelect = (obj) => {
  let index = obj.attributes.colorIndex.value
  selectedId = index
  selectedColor = data.item.colors[index].name
  document.getElementById('product-color-name').innerText = selectedColor
  document.getElementById('product-color-name').classList.add('selected')
}

const handleColorHover = (obj) => {
  let index = obj.attributes.colorIndex.value
  hoveredColor = data.item.colors[index].name
  document.getElementById('product-color-name').innerText = hoveredColor
  if (hoveredColor !== selectedColor) {
    document.getElementById('product-color-name').classList.remove('selected')
  }
}

const displaySelectedColor = () => {
  document.getElementById('product-color-name').innerText = selectedColor
  document.getElementById('product-color-name').classList.add('selected')
}

const handleAddToCart = (event) => {
  event.preventDefault()

  cartEmpty = false;

  quantity += parseInt(document.getElementById('item-quantity').value);
  document.getElementById('confirmation-image').setAttribute('style', `
    background-image: url(${data.item.colors[selectedId].photo})
  `)
  document.getElementById('confirmation-item').innerText = data.item.name;
  document.getElementById('confirmation-color').innerText = selectedColor;
  if (quantity < 2) {
    document.getElementById('confirmation-quantity').innerText = `${quantity} брой`
    document.getElementById('confirmation-message').innerText = 'Артикулът е успешно добавен в кошницата Ви!'
  } else {
    document.getElementById('confirmation-quantity').innerText = `${quantity} броя`
    document.getElementById('confirmation-message').innerText = 'Артикулите са успешно добавени в кошницата Ви!'
  }
  document.getElementById('cart-quantity').innerText = quantity

  // show recommendations
  if (!recommendationsLoaded) {
    recommendationsLoaded = true;
    getRecommendations()
  }
  document.getElementById('recommendations-container').classList.remove('hidden')

  // show and hide confirmation message
  document.getElementById('confirmation-message-container').classList.remove('hidden')
  window.scrollTo({ top: 0, letf: 0, behavior: 'smooth' })
  const interval = setInterval(() => {
    document.getElementById('confirmation-message-container').classList.add('hidden')
    clearInterval(interval)
  }, 3000)

}

const openGallery = (obj) => {
  let name = obj.attributes.photo.value
  galleryImage = `./assets/photos/${name}.jpg`
  document.getElementById('gallery-image').setAttribute('style', `background-image: url(${galleryImage})`)
  document.getElementById('gallery').classList.remove('hidden');
  document.body.classList.add('of-hidden');
  document.body.scrollIntoView()
}

const nextGalleryImage = () => {
  let current = parseInt(galleryImage.replace(onlyNumbers, ''))
  let next = ''
  if (current >= 3) {
    current = 0
    next = `./assets/photos/${current}.jpg`
  } else {
    next = `./assets/photos/${current + 1}.jpg`
  }
  galleryImage = next
  document.getElementById('gallery-image').setAttribute('style', `background-image: url(${galleryImage})`)
}

const previousGalleryImage = () => {
  let current = parseInt(galleryImage.replace(onlyNumbers, ''))
  let previous = ''
  if (current <= 0) {
    current = 3
    previous = `./assets/photos/${current}.jpg`
  } else {
    previous = `./assets/photos/${current - 1}.jpg`
  }
  galleryImage = previous
  document.getElementById('gallery-image').setAttribute('style', `background-image: url(${galleryImage})`)
}

const closeGallery = () => {
  document.getElementById('gallery').classList.add('hidden')
  document.body.classList.remove('of-hidden');
}

window.onload = () => {
  initialize()
  handleResize()
}
window.onresize = () => {
  handleResize()
}