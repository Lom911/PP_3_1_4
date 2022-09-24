const usersURL = 'http://localhost:8080/api/admin'
const rolesURL = 'http://localhost:8080/api/admin/roles'
let rolesBuffer
let allUser = []
/*
    HTTP Запрос
*/

function getRequest(url) {

    return fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .catch(err => console.error(err))
}




function postRequest(url, method, body = null) {

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (response.ok) {
            return response.json().then((users) => {
                users.forEach((user) => {
                    allUser.push(user)
                })
            })
        }

        return response.json().then(error => {
            const e = new Error('Something wrong while POST request')
            e.data = error
            throw e
        })
    })
}

function putRequest(url, method, body = null) {

    return fetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (response.ok) {
            return response.json().then((users) => {
                users.forEach((user) => {
                    allUser.push(user)
                })
            })
        }
        return response.json().then(error => {
            const e = new Error('Something wrong while PUT request')
            e.data = error
            throw e
        })
    })
}

function deleteRequest(url) {

    return fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => console.log(response))
        .catch(err => console.error(err))
}

/*
    Инициализация
*/
function documentReady() {
    document.getElementById("editCheckbox").innerHTML = ''
    document.getElementById("addCheckbox").innerHTML = ''
    document.getElementById("deleteCheckbox").innerHTML = ''

    getRequest(usersURL).then(data =>  insertUsersData(data))
    getRequest(rolesURL).then(data => {
        rolesBuffer = data
        createCheckbox(data, "editCheckbox")
        createCheckbox(data, "addCheckbox")
        createCheckbox(data, "deleteCheckbox")
    })
}

function insertUsersData(data) {
    fetch(usersURL)
        .then(res => res.json())
        .then(users => {
            let temp;
            if (users.length > 0) {
                temp = "";
                users.forEach((user) => {
                    temp += '<tr id="' + user.id + '">'
                    temp += "<td>" + user.id
                    temp += "<td>" + user.firstName
                    temp += "<td>" + user.lastName
                    temp += "<td>" + user.email
                    temp += "<td>" + user.address
                    temp += "<td>" + user.roles.map(role => ' ' + role.role)
                    temp += "<td>" + '<button class="btn btn-info" data-toggle="modal" onclick="editModal(' + user.id + ')">Edit</button>';
                    temp += "<td>" + '<button class="btn btn-danger" data-toggle="modal" onclick="deleteModal()">Delete</button>';

                })
            }
                document.querySelector('#usersData').innerHTML = temp
        })

}


function createCheckbox(data, elementName) {
    const rolesCheckbox = document.getElementById(elementName)

    for (let i = 0; i < data.length; i++) {
        let formCheckInline = document.createElement("div")
        formCheckInline.setAttribute("class", "form-check form-check-inline mx-0")

        let checkbox = document.createElement("input")
        checkbox.setAttribute("class", "form-check-input mx-0")
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("value", "")
        checkbox.setAttribute("id", rolesBuffer[i].id + elementName)
        if (elementName === 'deleteCheckbox') {
            checkbox.disabled = true
        }

        let label = document.createElement("label")
        label.setAttribute("class", "form-check-label h6 mx-0")
        label.innerText = rolesBuffer[i].role

        formCheckInline.appendChild(label)
        formCheckInline.appendChild(checkbox)
        rolesCheckbox.appendChild(formCheckInline)

        checkbox.addEventListener('change', () => {
            if (checkbox.hasAttribute("checked")) {
                checkbox.removeAttribute("checked")
            } else {
                checkbox.setAttribute("checked", "true")
            }
        })
    }
}

/*
    Добавление пользователя
*/

function addUser() {
    let rolesArray = []
    rolesBuffer.forEach(role => {
        if (document.getElementById(role.id + "addCheckbox")
            .hasAttribute("checked")) {
            rolesArray.push(role)
        }
    })


    const body = {
        firstName: $("#firstNameNew").val(),
        lastName: $("#lastNameNew").val(),
        email: $("#emailNew").val(),
        address: $("#addressNew").val(),
        password: $("#passwordNew").val(),
        roles: rolesArray
    }

    postRequest(usersURL, 'POST', body)
        .then(data => {
            document.getElementById("usersData").innerHTML = ''
            documentReady()
        })
        .then(() => {
            $("#firstNameNew").val('')
            $("#lastNameNew").val('')
            $("#emailNew").val('')
            $("#addressNew").val('')
            $("#passwordNew").val('')
        })

    $('#usersTableTab').tab('show')
}

/*
    Изменение пользователя
*/
function editModal() {

    $("#editModal").modal('show')
    let id = event.target.parentNode.parentNode.id

    getRequest(usersURL + '/' + id)
        .then(data => {
            $("#idEdit").val(data.id)
            $("#firstNameEdit").val(data.firstName)
            $("#lastNameEdit").val(data.lastName)
            $("#emailEdit").val(data.email)
            $("#addressEdit").val(data.address)
            $("#passwordEdit").val(data.password)

            rolesBuffer.forEach(roleFromBuffer => {
                data.roles.forEach(role => {
                    if (role.role === roleFromBuffer.role) {
                        document.getElementById(roleFromBuffer.id + "editCheckbox")
                            .setAttribute("checked", "true")
                    }
                })
            })
        })
}

function editUser() {

    let rolesArray = []
    rolesBuffer.forEach(role => {
        if (document.getElementById(role.id + "editCheckbox")
            .hasAttribute("checked")) {
            rolesArray.push({
                id: role.id,
                role: role.role
            })
        }
    })

    const body = {
        id: $("#idEdit").val(),
        firstName: $("#firstNameEdit").val(),
        lastName: $("#lastNameEdit").val(),
        email: $("#emailEdit").val(),
        address: $("#addressEdit").val(),
        password: $("#passwordEdit").val(),
        roles: rolesArray
    }

    putRequest(usersURL, 'PUT', body)
        .then(data => {
            document.getElementById("usersData").innerHTML = ''
            documentReady()

        })
        .then($("#editModal").modal('hide'))

}

/*
    Удаление пользователя
*/
function deleteModal() {

    $("#deleteModal").modal("show")
    let id = event.target.parentNode.parentNode.id

    getRequest(usersURL + '/' + id)
        .then(data => {
            $("#idDelete").val(data.id)
            $("#firstNameDelete").val(data.firstName)
            $("#lastNameDelete").val(data.lastName)
            $("#emailDelete").val(data.email)
            $("#addressDelete").val(data.address)
            $("#passwordDelete").val(data.password)

            rolesBuffer.forEach(roleFromBuffer => {
                data.roles.forEach(role => {
                    if (role.role === roleFromBuffer.role) {
                        document.getElementById(roleFromBuffer.id + "deleteCheckbox")
                            .setAttribute("checked", "true")
                    }
                })
            })
        })
}

function deleteUser() {

        deleteRequest(usersURL + '/' + $("#idDelete").val())
            .then(data => {
                document.getElementById("usersData").innerHTML = ''
                documentReady()
            })
            .then($("#deleteModal").modal('hide'))


}

documentReady()
