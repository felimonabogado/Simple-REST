class UsersTable {
    constructor(api, el){
        this.el = document.getElementById(el);
        this.api = api;
        this.userList();
    }

    userList(notification = null){
        fetch(this.api)
        .then(response => response.json())
        .then(data => {
            let content =``;
            content += `<h1>Users</h1>`;
            content += (notification !== null) ? `<p>${notification.message}</p>` : ``;
            content += `<p><button class="single-user">Add User</button></p>`;
            content += `<table style="width:100%; border-collapse: collapse;" border="1">`;
                content += `<tr>`;
                    content += `<th>ID</th>`;
                    content += `<th>Name</th>`;
                    content += `<th>Email</th>`;
                    content += `<th>Action</th>`;
                content += `</tr>`;

                data.map((user, index) => {
                    content += `<tr class="user-count-${index}">`;
                        content += `<td>${user.id}</td>`;
                        content += `<td>${user.name}</td>`;
                        content += `<td><a href="mailto:${user.email}">${user.email}</td>`;
                        content += `<td style="text-align: center;">`;
                            content += `<button class="single-user" user-id="${user.id}">Edit</button>`;
                            content += `&nbsp;`;
                            content += `<button class="delete-user" data-id="${user.id}">Delete</button>`;
                        content += `</td>`;
                    content += `</tr>`;
                });

            content += `</table>`;
            this.el.innerHTML = content;
            
            let single_user = document.querySelectorAll(".single-user");
            single_user.forEach((element) => {
                element.addEventListener("click", () => this.singleUser(element.getAttribute("user-id")));
            });
            let delete_user = document.querySelectorAll(".delete-user");
            delete_user.forEach((element) => {
                element.addEventListener("click", () => this.deleteUser(element.getAttribute("data-id")));
            });
        })
        .catch(error => {
            this.el.innerHTML = "Something went wrong &#129402; check the console for details.";
            console.error(error);
        });
    }

    singleUser(user_id){
        let content =``;
            content += `<h1>${(user_id == null) ? `Add User` : `Edit User`}</h1>`;
            content += `<p><button id="back">Back</button></p>`;
            content += `<table style="width:100%; border-collapse: collapse;" border="1">`;
                content += (user_id !== null) ? `<tr><th>User</th><td>#${user_id}</td></tr>` : ``;
                content += `<tr>`;
                    content += `<th>Name</th>`;
                    content += `<td><input type="text" name="name" id="name" style="width: fit-content;width: -webkit-fill-available;"></td>`;
                content += `</tr>`;
                content += `<tr>`;
                    content += `<th>Email</th>`;
                    content += `<td><input type="email" name="email" id="email" style="width: fit-content;width: -webkit-fill-available;"></td>`;
                content += `</tr>`;
                    content += `<th>Action</th>`;
                    content += `<td id="action"><button id="save-user">Register</button></td>`;
                content += `<tr>`;
                content += `</tr>`;
            content += `</table>`;
        this.el.innerHTML = content;
        document.getElementById("back").addEventListener("click", () => this.userList());
       
        if(user_id !== null){
            fetch(this.api + `?id=${user_id}`)
            .then(response => response.json()) 
            .then(data => {
                document.getElementById("name").value = data.name;
                document.getElementById("email").value = data.email;
                document.getElementById("action").innerHTML = `<button id="update-user" data-id="${user_id}">Update</button>&nbsp;<button id="delete-user" data-id="${user_id}">Delete</button>`;
                document.getElementById("update-user").addEventListener("click", (event) => this.editUser(event.target.getAttribute("data-id")));
                document.getElementById("delete-user").addEventListener("click", (event) => this.deleteUser(event.target.getAttribute("data-id")));
            })  
            .catch(error => {
                this.el.innerHTML = "Error: " + error;
            });
        }else{
            document.getElementById("action").innerHTML = `<button id="save-user">Register</button>`;
            document.getElementById("save-user").addEventListener("click", () => this.addUser());
        }
    }

    addUser(){
        const newUser = {
            name:  document.getElementById("name").value,
            email: document.getElementById("email").value,
        };
        if(newUser.name === "" || newUser.email === ""){
           alert("All fields are required!");
        }else{
            const data = JSON.stringify(newUser);
            fetch(this.api, {
                method: "POST",
                body: data,
            })
            .then(response => response.json())
            .then(data => {
                this.userList(data);
            })
            .catch(error => {
                this.el.innerHTML = "Error: " + error;
            });
        }
    }

    editUser(user_id){
        const userData = {
            id: user_id,
            name:  document.getElementById("name").value,
            email: document.getElementById("email").value,
        };

        if(userData.name === "" || userData.email === ""){
            alert("All fields are required!");
        }else{
            const data = JSON.stringify(userData);
            fetch(this.api, {
                method: "PUT",
                body: data,
            })
            .then(response => response.json())
            .then(data => {
                this.userList(data);
            })
            .catch(error => {
                this.el.innerHTML = "Error: " + error;
            });
        }
    }

    deleteUser(user_id){
        if(confirm(`Are you sure you want to delete this user #${user_id}?`)){
            fetch(this.api, {
                method: "DELETE",
                body: JSON.stringify({id: user_id}),
            })
            .then(response => response.json())
            .then(data => {
                this.userList(data);
            })
            .catch(error => {
                this.el.innerHTML = "Error: " + error;
            });
        }
    }
}

const Users = new UsersTable("http://localhost/Rest-API/api.php/", "users_table");