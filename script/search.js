function bookSearch(keyword) {
	const filter = keyword.toUpperCase();
	const bookListH3 = document.getElementsByTagName("h3");

	for (let i = 0; i < bookListH3.length; i++) {
		const titlesText = bookListH3[i].textContent || bookListH3[i].innerText;

		if (titlesText.toUpperCase().indexOf(filter) > -1) {
			bookListH3[i].closest(".card").style.display = "";
		} else {
			bookListH3[i].closest(".card").style.display = "none";
		}
	}
}