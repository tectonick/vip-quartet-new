document.getElementById('save-button').addEventListener("click", () => {
    event.preventDefault();
    var http = new XMLHttpRequest();
    var data = new FormData(document.getElementById('gallery-form'));
    http.open("POST", "/admin/upload", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('edit-form').submit();
        }
    };
    http.send(data);
});
document.getElementById('add-repertoire-button').addEventListener("click", () => {
    event.preventDefault();
    let newId = document.querySelectorAll('.repertoire-card').length;
    let repertoireAccordion = document.getElementById("accordionExample");

    let newNode = document.createElement("div");
    newNode.innerHTML = `<div class="card repertoire-card" num="${newId}">
                    <a class="delete-repertoire-button" href=""><img src="/img/ui/delete-icon.png"
                            alt="delete repertoire"></a>
                    <div id="heading${newId}" class="card-header border-0">

                        <h6 class="mb-0 font-weight-bold"><a href="#" data-toggle="collapse"
                                data-target="#collapse${newId}" aria-expanded="false"
                                aria-controls="collapseOne"
                                class="pr-5 d-block position-relative collapsed collapsible-link py-2"><textarea
                                    name="repertoire[${newId}][name]" rows="1">Название списка</textarea></a>
                        </h6>
                    </div>
                    <div id="collapse${newId}" aria-labelledby="heading${newId}"
                        data-parent="#accordionExample" class="collapse">
                        <div class="card-body">
                            <textarea name="repertoire[${newId}][data]" rows="10">Репертуарный список</textarea>
                            <input type="hidden" name="repertoire[${newId}][id]" value="${newId}"/>
                        </div>
                    </div>
                </div>`;
    let deleteButton = newNode.querySelector(".delete-repertoire-button");
    addDeleteParentEvent(deleteButton);
    repertoireAccordion.appendChild(newNode);
})
document.getElementById('add-phone-button').addEventListener("click", () => {
    event.preventDefault();
    let newId = document.querySelectorAll('.contact-phone').length;
    let phones = document.getElementById("phones");

    let newNode = document.createElement("div");
    newNode.innerHTML = `<div num="${newId}" class="contact-phone">\
            <input type="hidden" name="contacts_phones[${newId}][id]" value="${newId}">\
            <textarea name="contacts_phones[${newId}][name]" rows="1">Имя</textarea>\
            <textarea name="contacts_phones[${newId}][phone]" rows="1">Телефон</textarea>\
            <a class="delete-contact-button" href=""><img src="/img/ui/delete-icon.png" alt="delete contact"></a>\
        </div>`;
    let deleteButton = newNode.querySelector(".delete-contact-button");
    addDeleteParentEvent(deleteButton);
    phones.appendChild(newNode);
});

function addDeleteParentEvent(element) {
    element.addEventListener("click", () => {
        event.preventDefault();
        element.parentElement.remove();
    })
};
document.querySelectorAll('.delete-repertoire-button').forEach((element) => {
    addDeleteParentEvent(element);
});

document.querySelectorAll('.delete-photo-button').forEach((element) => {
    element.addEventListener("click", () => {
        //event.preventDefault();
        let toDelete = document.createElement("div");
        toDelete.innerHTML = `<input type="hidden" name="photosToDelete[]" value="${element.getAttribute("link")}">`;
        document.getElementById('photo').appendChild(toDelete);
        element.parentElement.remove();
    })
});


document.querySelectorAll('.delete-contact-button').forEach((element) => {
    element.addEventListener("click", () => {
        event.preventDefault();
        element.parentElement.remove();
    })
});

document.querySelectorAll(".video-item").forEach((element) => {
    var iframe = element.querySelector(".responsive-iframe");
    var textarea = element.querySelector("textarea");
    var inputVideoId = element.querySelector(".videoId-input");
    textarea.addEventListener('input', () => {
        let youtubeId = GetYoutubeId(textarea.value);
        iframe.setAttribute("src", `https://www.youtube.com/embed/${youtubeId}`);
        inputVideoId.setAttribute("value", youtubeId);
    });
});

function GetYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? match[2]
        : null;
}