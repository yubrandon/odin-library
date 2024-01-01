//Remove autocomplete from all input fields
const inputs = document.querySelectorAll('input');
for(let i=0;i<inputs.length;i++) {
    inputs[i].setAttribute('autocomplete',"off");
}

//Array declaration
const myLibrary = [];
//Constructor for Book object
function Book(title,author,pages,read,notes) {
    this.title = title;
    this.author = author;
    this.pages=pages;
    this.read=read;
    this.notes = notes;
}
//Function to create Book objects and push to library array
function addBookToLibrary(title,author,pages,read,notes) {
    let book = new Book(title,author,pages,read,notes);
    myLibrary.push(book);
}

//Creates a card for each array item and appends it to the DOM
function display() {
    const library = document.querySelector('.container');
    for(let i=0;i<myLibrary.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        
        let title = document.createElement('p');
        title.classList.add('card-header');
        title.innerHTML = "<span class='book-title'>" +  myLibrary[i].title + "</span>";
        card.appendChild(title);

        let author = document.createElement('p');
        author.classList.add('card-header');
        author.innerHTML = 'by ' + '<span class="book-author">'+ myLibrary[i].author + '</span>';
        card.appendChild(author);

        let pages = document.createElement('p'); 
        pages.classList.add('card-body');
        pages.innerText = 'Pages: ' + myLibrary[i].pages;       
        card.appendChild(pages);

        //Create button when adding value of read or not read - allows for toggling
        let read = document.createElement('button'); 
        read.classList.add('read-bool');
        //Stying for interactivity
        read.style.boxShadow = '2px 1px 2px lightgray';
        //When declaring button, use boolean value read to determine color and text
        if(myLibrary[i].read == true){
            read.innerText = 'Completed';
            read.style.backgroundColor = 'lightgreen';
        }
        else {
            read.innerText ='Not Completed';
            read.style.backgroundColor = 'lightcoral';
        }
        //On click, toggle the color and text
        read.addEventListener('click', () => {
            //Get all sibling elements
            let node = read.parentNode.childNodes;

            //Call getIndex using list of sibling elements
            //getIndex will return array index of the toggled node
            let target = getIndex(node);
            
            //Invert the read boolean of the node at the found index
            myLibrary[target].read = !myLibrary[target].read;

            //Use changed boolean to change styling of target node
            if(myLibrary[i].read == true) {
                read.innerText = 'Completed';
                read.style.backgroundColor = 'lightgreen';
            }
            else {
                read.innerText ='Not Completed';
                read.style.backgroundColor = 'lightcoral';
            }
        })
        card.appendChild(read);


        let notes = document.createElement('p'); 
        notes.classList.add('card-body');
        notes.classList.add('card-notes');
        notes.innerText = myLibrary[i].notes;       
        card.appendChild(notes);

        //Div used to contain remove button for styling purposes
        let del_div = document.createElement('div');
        del_div.classList.add('del-div');

        //Button for removing child
        let del_btn = document.createElement('button');
        del_btn.id = 'del-btn';
        del_btn.style.boxShadow = '2px 1px 2px gray';
        del_btn.innerText = 'Remove Book';

        del_btn.addEventListener('click', () => {
            //ancestor == container
            //parent == card containg target node's values (siblings)
            let ancestor = document.querySelector('.container');
            let parent = del_btn.parentNode.parentNode.childNodes;

            //getCardIndex returns the index of the target node out of an array of all cards
            let index = getCardIndex(ancestor,parent);

            //Select all cards
            let list = document.querySelectorAll('.card');

            //Select the target card using the found index and remove from the container
            ancestor.removeChild(list[index]);

            //Remove the target node's values from the library array
            myLibrary.splice(getIndex(parent),1);
        })

        del_div.appendChild(del_btn);

        card.appendChild(del_div);
        library.appendChild(card);
    }
}
function clear() {
    const library = document.querySelector('.container');
    if(library.hasChildNodes())
    {
        //Iterates through each card in the container and deletes them
        let del = document.querySelectorAll('.container > .card');
        for(let i=0;i<del.length;i++) {
            library.removeChild(del[i]);
        }
    }
}

//Sample instantiation
addBookToLibrary('hunger games','jk rowling',123,true,'cool');
addBookToLibrary('harry potter','james patterson',999,false,'magical');
addBookToLibrary('harry potter2','james patterson II',10000,false,'crazy');
display();


//Closes dialog if screen is clicked
const dialog = document.querySelector('.modal');
dialog.addEventListener('click',()=> dialog.close());

//Opens dialog when pressing 'NEW BOOK' button
const newbook = document.querySelector('.new-book');
newbook.addEventListener('click', () => {
    dialog.showModal();
})

//Prevents dialog from closing when clicking inside the form
const modal = document.querySelector('.modal-form');
modal.addEventListener('click',(event)=>event.stopPropagation());

//Form submission within dialog
const submit = document.querySelector('#library-form');
submit.addEventListener('submit', (event) => {
    //Check validity first, else required keyword does not work
    if(!submit.checkValidity()){
        return;
    }
    else {
        //If requirements passed, preventDefault() to stop page route
        event.preventDefault();

        //Get input values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const pages = document.querySelector('#pages').value;
        const read = document.querySelector('#read').checked;
        const notes = document.querySelector('#notes').value;

        //Add values as a Book object to library array and close dialog
        addBookToLibrary(title,author,pages,read,notes);
        dialog.close();

        //Delete all card elements and redisplay to include new array value
        clear();
        display();

        //Reset form to remove previous values
        submit.reset();
    }        
});

function getCardIndex(ancestor,parent) {
    let cards = ancestor.childNodes;
    //Iterate through each card
    for(let i=0;i<cards.length;i++) {
        //If card[i]'s values match target card's values, return i
        if(cards[i].childNodes == parent) {
            return i;
        }
    }
    return;
}

function getIndex(nodes) {
    //'check' variable is used to determine if display value is 'Completed' or 'Not Completed'
    let check = false;
    if(nodes[3].innerText == 'Completed') check = true;
    else check = false;

    //Loop through each array item
    for(let i=0;i<myLibrary.length;i++) {
        //For every array item, compare with siblings of target node
        if(myLibrary[i].title == nodes[0].innerText && 
        myLibrary[i].author == nodes[1].innerText.slice(3) &&
        myLibrary[i].pages == nodes[2].innerText.slice(7) && 
        myLibrary[i].read == check && 
        myLibrary[i].notes == nodes[4].innerText) {
            
            //If values match, we have found the index of the target node
            return i;
        }
    }
}
