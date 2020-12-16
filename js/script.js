{
  const titleClickHandler = function (event) {
    event.preventDefault();

    const clickedElement = this;
    console.log("Link was clicked!");

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(".titles a.active");

    for (const activeLink of activeLinks) {
      activeLink.classList.remove("active");
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add("active");

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll(".post.active");

    for (const activeArticle of activeArticles) {
      activeArticle.classList.remove("active");
    }

    /* get 'href' attribute from the clicked link */
    let attribute = clickedElement.getAttribute("href");

    /* find the correct article using the selector (value of 'href' attribute) */
    const article = document.querySelector(attribute);

    /* add class 'active' to the correct article */
    article.classList.add("active");
  };

  const optArticleSelector = ".post",
    optTitleSelector = ".post-title",
    optTitleListSelector = ".titles";

  function generateTitleLinks() {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = "";

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector);

    let html = "";

    for (const article of articles) {
      /* get the article id */
      const articleId = article.getAttribute("id");

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML =
        '<li><a href="#' +
        articleId +
        '"><span>' +
        articleTitle +
        "</span></a></li>";
      /* insert link into titleList */

      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll(".titles a");

    for (let link of links) {
      link.addEventListener("click", titleClickHandler);
    }
  }

  generateTitleLinks();
}
