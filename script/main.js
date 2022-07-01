const book = [];
let formMode = 'buat';
let bookIdEdit = '';
const RENDER_EVENT = 'render-book';
const SAVE_EVENT = 'bookshelf';
const bookKey = 'STORAGE_BOOK';

document.addEventListener('DOMContentLoaded', function(){
	const formSubmit = document.getElementById('inputBook');
	formSubmit.addEventListener('submit', function(e){
		e.preventDefault();
		alert("berhasil memasukkan buku!");
		tambahBuku();
		formSubmit.reset();
	});
	if (isStorageExit()) {
		loadDataFromStorage();
	}

	const searchBook = document.getElementById("searchBook");
	searchBook.addEventListener('submit', function(e){
		e.preventDefault();
		const searchInput = document.getElementById("searchBookTitle").value;
		bookSearch(searchInput);
	});
});

function tambahBuku() {
	const inputBookTitle = document.getElementById("inputBookTitle").value;
	const inputBookAuthor = document.getElementById("inputBookAuthor").value;
	const inputBookYear = document.getElementById('inputBookYear').value;
	const isCompleted = document.getElementById("inputBookIsComplete").checked;

	const idBook = +new Date();
	const bookObject = generateBookObject(idBook, inputBookTitle, inputBookAuthor, inputBookYear, isCompleted);
	book.push(bookObject);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function generateBookObject(id, title, author, year, isCompleted) {
	return {
		id,
		title,
		author,
		year,
		isCompleted
	}
}

function rakBook(bookObject) {
	const bookTitle = document.createElement("h3");
	bookTitle.innerText = "Title : " + bookObject.title;

	const authorBook = document.createElement("p");
	authorBook.innerText = "Author : " + bookObject.author;

	const yearBook = document.createElement("p");
	yearBook.innerText = "Year : " + bookObject.year;

	const wipeBook = document.createElement("button");
	wipeBook.innerText = "Hapus";
	wipeBook.setAttribute("id", "hapus")
	wipeBook.classList.add("btn", "btn-danger");

	const actionBook = document.createElement("div");
	actionBook.setAttribute("class", "action");

	const cardBodyBook = document.createElement("div");
	cardBodyBook.classList.add("card-body");
	cardBodyBook.append(bookTitle, authorBook, yearBook);

	const cardBook = document.createElement("div");
	cardBook.classList.add("card");
	cardBook.append(cardBodyBook);

	const articleBook = document.createElement("article");
	articleBook.setAttribute("id", `book-${bookObject.id}`);
	articleBook.append(cardBook);

	if (bookObject.isCompleted) {
		const notReadBook = document.createElement("a");
		notReadBook.classList.add("btn", "btn-success");
		notReadBook.innerText = "Belum selesai dibaca";
		actionBook.append(wipeBook, notReadBook);

		notReadBook.addEventListener('click', function() {
			undoBookFromCompleted(bookObject.id);
		});
		wipeBook.addEventListener('click', function() {
			const confirmHapus = confirm("yakin ingin menghapus buku : " + bookObject.title + "?");
			if (confirmHapus) {
				removeBookFromCompleted(bookObject.id);
			}
		});
		cardBodyBook.append(actionBook);

	} else {
		const readBook = document.createElement("button");
		readBook.innerText = "Sudah dibaca";
		readBook.setAttribute("id", "success");
		readBook.classList.add("btn", "btn-success");

		const editBook = document.createElement("button");
		editBook.classList.add("btn", "btn-warning");
		editBook.setAttribute("id", "edit");
		editBook.setAttribute("data-bs-toggle", "modal");
		editBook.setAttribute("data-bs-target", "#edit");
		editBook.innerText = "Edit";

		actionBook.append(wipeBook, readBook, editBook);

		readBook.addEventListener('click', function() {
			addBookFromCompleted(bookObject.id);
		});
		wipeBook.addEventListener('click', function() {
			const confirmHapus = confirm("yakin ingin menghapus buku : " + bookObject.title + "?");
			if (confirmHapus) {
				removeBookFromCompleted(bookObject.id);
			}
		});
		editBook.addEventListener('click', function(e) {
			e.stopPropagation();
			field_book(bookObject); 
		});
		cardBodyBook.append(actionBook);

	}
	return articleBook;
}

function addBookFromCompleted(bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget === null) return
	bookTarget.isCompleted = true
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function undoBookFromCompleted(bookId) {
	const bookTarget = findBook(bookId)
	if (bookTarget == null) return
	bookTarget.isCompleted = false
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function removeBookFromCompleted(bookId) {
	const bookTarget = findIndexBook(bookId);

	if (bookTarget === null) return

	book.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function findBook(bookId) {
	for(const bookItem of book) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null
}
function findIndexBook(bookId) {
	for(const bookIndex in book) {
		if (book[bookIndex].id === bookId) {
			return bookIndex;
		}
	}
	return -1
}
var editTitle = document.getElementById("editJudul"),
	editAuthor = document.getElementById("editAuthor"),
	editYear = document.getElementById("editYear");
function field_book(bookObject) {
	const save = document.getElementById("save");
	editTitle.value = bookObject.title;
	editAuthor.value = bookObject.author;
	editYear.value = bookObject.year;
	formMode = 'baru';
	bookIdEdit = bookObject.id;
} 

const save = document.getElementById("save");
save.addEventListener('click', function(){
	if (formMode === 'baru') {
		editBook(bookIdEdit);
	}
});

function editBook(bookId) {
	const bookIndex = book.findIndex((item => item.id === bookId));
	if (bookIndex === -1) return null
	book[bookIndex].title = editTitle.value;
	book[bookIndex].author = editAuthor.value;
	book[bookIndex].year = editYear.value;
	document.dispatchEvent(new Event(RENDER_EVENT));
	formMode = 'buat';
	bookIdEdit = '';
	saveData();
}


function isStorageExit() {
	if (typeof(Storage) === undefined) {
		alert("browser tidak support")
		return false
	}
	return true
}

function saveData() {
	if (isStorageExit()) {
		localStorage.setItem(bookKey, JSON.stringify(book));
		document.dispatchEvent(new Event(SAVE_EVENT));
	}
}

function loadDataFromStorage() {
	const seriallizeData = localStorage.getItem(bookKey);
	let data = JSON.parse(seriallizeData);
	if (data !== null) {
		for(const bookItem of data ) {
			book.push(bookItem);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function(){
	const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
	incompleteBookshelfList.innerHTML = '';
	const completeBookshelfList = document.getElementById("completeBookshelfList");
	completeBookshelfList.innerHTML = '';
	for(const bookItem of book) {
		const bookElement = rakBook(bookItem);
		if (!bookItem.isCompleted) {
			incompleteBookshelfList.append(bookElement);			
		} else {
			completeBookshelfList.append(bookElement);
		}
	}
})

