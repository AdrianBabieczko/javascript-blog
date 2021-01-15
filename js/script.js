const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-CloudLink').innerHTML),
  authorsLink: Handlebars.compile(document.querySelector('#template-authors-Links').innerHTML)
};

const titleClickHandler = function (event) {
  event.preventDefault();

  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');

  for (const activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  let attribute = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const article = document.querySelector(attribute);

  /* add class 'active' to the correct article */
  article.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (const article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags){
  let params = {max:0, min: 999999};

  for (let tag in tags){
    params.max = tags[tag] > params.max ? tags[tag] : params.max;

    params.min = tags[tag] < params.min ? tags[tag] : params.min;
  }

  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount/normalizedMax;

  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll('.post');

  /* START LOOP: for every article: */
  for (const article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    let articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (const tag of articleTagsArray) {

      const linkHTMLData = {tag:tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      }
      else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in all Tags: */
  for(let tag in allTags){

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-' + tag +'"]');

  /* START LOOP: for each active tag link */
  for (const activeLink of activeTagLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefLinks = document.querySelectorAll('a[href ="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (const link of hrefLinks) {
    /* add class active */
    link.classList.add('active');
  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */
  const linksToTags = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (const link of linksToTags) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll('.post');

  /* START LOOP: for every article: */
  for (const article of articles) {
    /* find authors wrapper */
    const authorsWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */
    let html = '';

    /* get author from data-author attribute */
    let articleAuthor = article.getAttribute('data-author');

    const linkHTMLData = {articleAuthor: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    html = html + linkHTML;

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[articleAuthor]){
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    }
    else {
      allAuthors[articleAuthor]++;
    }

    /* insert HTML of all the links into the tags wrapper */
    authorsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of authorsList in right column */
  const authorsList = document.querySelector(optAuthorsListSelector);

  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {authors: []};

  /* [NEW] START LOOP: for each tag in all Tags: */
  for(let author in allAuthors){

    allAuthorsData.authors.push({
      author:author,
      count:allAuthors[author]
    });
  }

  authorsList.innerHTML = templates.authorsLink(allAuthorsData);
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const linksToAuthors = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (const link of linksToAuthors) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all author links with class active */
  const activeAuthorsLinks = document.querySelectorAll('a.active[href^="#author-' + author +'"]');

  /* START LOOP: for each active author link */
  for (const activeAuthorLink of activeAuthorsLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const hrefLinks = document.querySelectorAll('a[href ="' + href + '"]');

  /* START LOOP: for each found author link */
  for (const link of hrefLinks) {
    /* add class active */
    link.classList.add('active');
  /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

{
  generateTitleLinks();
  generateTags();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();
}
