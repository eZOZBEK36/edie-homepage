class DynamicAdapt {
	constructor(type) {
		this.type = type
	}
	init () {
		const _this = this

		this.оbjects = []
		this.daClassname = "_dynamic_adapt_"
		this.nodes = document.querySelectorAll("[data-da]")

		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[ i ]
			const data = node.dataset.da.trim()
			const dataArray = data.split(",")
			const оbject = {}
			оbject.element = node
			оbject.parent = node.parentNode
			оbject.destination = document.querySelector(dataArray[ 0 ].trim())
			оbject.breakpoint = dataArray[ 1 ] ? dataArray[ 1 ].trim() : "767"
			оbject.place = dataArray[ 2 ] ? dataArray[ 2 ].trim() : "last"
			оbject.index = this.indexInParent(оbject.parent, оbject.element)
			this.оbjects.push(оbject)
		}

		this.arraySort(this.оbjects)

		this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
			return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint
		}, this)
		this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
			return Array.prototype.indexOf.call(self, item) === index
		})

		for (let i = 0; i < this.mediaQueries.length; i++) {
			const media = this.mediaQueries[ i ]
			const mediaSplit = String.prototype.split.call(media, ',')
			const matchMedia = window.matchMedia(mediaSplit[ 0 ])
			const mediaBreakpoint = mediaSplit[ 1 ]
			const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
				return item.breakpoint === mediaBreakpoint
			})
			matchMedia.addListener(function () {
				_this.mediaHandler(matchMedia, оbjectsFilter)
			})
			this.mediaHandler(matchMedia, оbjectsFilter)
		}
	}
	mediaHandler (matchMedia, оbjects) {
		if (matchMedia.matches) {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[ i ]
				оbject.index = this.indexInParent(оbject.parent, оbject.element)
				this.moveTo(оbject.place, оbject.element, оbject.destination)
			}
		} else {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[ i ]
				if (оbject.element.classList.contains(this.daClassname)) {
					this.moveBack(оbject.parent, оbject.element, оbject.index)
				}
			}
		}
	}

	moveTo (place, element, destination) {
		element.classList.add(this.daClassname)
		if (place === 'last' || place >= destination.children.length) {
			destination.insertAdjacentElement('beforeend', element)
			return
		}
		if (place === 'first') {
			destination.insertAdjacentElement('afterbegin', element)
			return
		}
		destination.children[ place ].insertAdjacentElement('beforebegin', element)
	}

	moveBack (parent, element, index) {
		element.classList.remove(this.daClassname)
		if (parent.children[ index ] !== undefined) {
			parent.children[ index ].insertAdjacentElement('beforebegin', element)
		} else {
			parent.insertAdjacentElement('beforeend', element)
		}
	}

	indexInParent (parent, element) {
		const array = Array.prototype.slice.call(parent.children)
		return Array.prototype.indexOf.call(array, element)
	}

	arraySort (arr) {
		if (this.type === "min") {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === "first" || b.place === "last") {
						return -1
					}
					if (a.place === "last" || b.place === "first") {
						return 1
					}
					return a.place - b.place
				}
				return a.breakpoint - b.breakpoint
			})
		} else {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === "first" || b.place === "last") {
						return 1
					}
					if (a.place === "last" || b.place === "first") {
						return -1
					}
					return b.place - a.place
				}
				return b.breakpoint - a.breakpoint
			})
			return
		}
	}
}

const da = new DynamicAdapt("max")
da.init()

const headerElement = document.querySelector('.header')

const headerObserver = new IntersectionObserver(entries => {
	if (!entries[ 0 ].isIntersecting) {
		headerElement.classList.add('_scroll')
	} else headerElement.classList.remove('_scroll')
})
headerObserver.observe(headerElement)

let n = 0

const resizeObserver = new ResizeObserver(entries => {
	if (window.innerWidth > 768) {
		document.documentElement.classList.remove('_lock')
		document.querySelector('.header__list').classList.remove('_open')
		n = 0
	}
})
resizeObserver.observe(document.documentElement)

document.addEventListener('click', e => {
	if (e.target.classList.contains('header__menu-button')) {
		if (n % 2 !== 0) {
			document.documentElement.classList.remove('_lock')
			document.querySelector('.header__list').classList.remove('_open')
		} else {
			document.documentElement.classList.add('_lock')
			document.querySelector('.header__list').classList.add('_open')
		}
		n += 1
	}
	if (/^\#/.test(e.target.hash)) {
		document.documentElement.classList.remove('_lock')
		document.querySelector('.header__list').classList.remove('_open')
	}
})