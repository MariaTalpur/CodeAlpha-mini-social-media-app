// ======== Security: Redirect agar login na ho ========
if (window.location.pathname.includes("home.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// ======== Global User Info ========
const feed = document.getElementById("feed");
const profileName = localStorage.getItem("userEmail") || "Guest"; // current user

// ======== Logout ========
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            window.location.href = "login.html";
        });
    }
});

// ======== Fixed Demo Posts ========
let posts = [
    {
        id: 1,
        name: "Ali Khan",
        email: "ali.khan@example.com",
        avatar: "https://i.pravatar.cc/50?img=1",
        image:
            "https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg",
        comment: "Amazing view!",
        likes: 0,
        comments: [],
        retweets: 0,
        following: false,
    },
    {
        id: 2,
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
        avatar: "https://i.pravatar.cc/50?img=2",
        image:
            "https://michiganross.umich.edu/sites/default/files/styles/max_325x325/public/images/news-story/butterfly.jpeg?itok=zndZsiuK",
        comment: "Love this!",
        likes: 0,
        comments: [],
        retweets: 0,
        following: false,
    },
    {
        id: 3,
        name: "Hassan Raza",
        email: "hassan.raza@example.com",
        avatar: "https://i.pravatar.cc/50?img=3",
        image:
            "https://render.fineartamerica.com/images/rendered/medium/print/8/5.5/break/images/artworkimages/medium/3/valley-of-gods-john-mueller.jpg",
        comment: "So cool!",
        likes: 0,
        comments: [],
        retweets: 0,
        following: false,
    },
];

// ======== Render Posts ========
function renderPosts() {
    if (!feed) return;
    feed.innerHTML = "";
    posts.forEach((post, index) => {
        const div = document.createElement("div");
        div.className = "post";

        // Render comments
        let commentsHtml = "";
        post.comments.forEach((c) => {
            commentsHtml += `<p class="post-comment">💬 ${c}</p>`;
        });

        div.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" class="avatar">
        <div class="user-info">
          <div class="flex">
            <strong class="user-name">${post.name}</strong>
            <p class="user-email">${post.email}</p>
          </div>
          <div>
            ${post.name !== profileName
                ? `<button class="follow-btn" onclick="followUser(${index})">${post.following ? "Unfollow" : "Follow"
                }</button>`
                : ""
            }
          </div>
        </div>
      </div>
      <img src="${post.image}" class="post-image">
      <p>${post.comment}</p>
      <div class="post-actions">
  <button onclick="likePost(${index})" class="icon-btn">
    <img src="images/fav.png" class="action-icon"> (${post.likes})
  </button>
  <button onclick="showCommentBox(${index})" class="icon-btn">
    <img src="images/comment.png" class="action-icon"> (${post.comments.length})
  </button>
  <button onclick="retweetPost(${index})" class="icon-btn">
    <img src="images/share.png" class="action-icon"> (${post.retweets})
  </button>
</div>
<div class="comment-box-container" id="commentBox${index}" style="display:none; margin-top:10px;">
  <input type="text" id="commentInput${index}" placeholder="Write a comment..." style="width:90%; padding:5px; border-radius:5px;">
  <button onclick="addComment(${index})" style="padding:5px 10px; border-radius:5px; margin-left:5px;">Post</button>
</div>
<div class="post-comments">${commentsHtml}</div>
    `;

        feed.appendChild(div);
    });
}

// ===== Actions =====
function likePost(i) {
    posts[i].likes++;
    renderPosts();
}
function retweetPost(i) {
    posts[i].retweets++;
    renderPosts();
}
function showCommentBox(i) {
    const box = document.getElementById(`commentBox${i}`);
    box.style.display = box.style.display === "none" ? "block" : "none";
}

// ===== Fix: single, correct addComment function (kept outside template) =====
function addComment(i) {
    const input = document.getElementById(`commentInput${i}`);
    if (!input) return; // safety

    const comment = input.value.trim();
    if (comment) {
        posts[i].comments.push(comment);
        input.value = "";
        renderPosts(); // update list and counters
    }
}

// ===== See More / See Less =====
const seeMoreBtn = document.getElementById("seeMoreBtn");
const suggestionItems = document.querySelectorAll(".suggestion-item");

if (seeMoreBtn) {
    suggestionItems.forEach((item, index) => {
        if (index >= 3) item.style.display = "none";
    });

    let expanded = false;

    seeMoreBtn.addEventListener("click", () => {
        expanded = !expanded;

        suggestionItems.forEach((item, index) => {
            if (index >= 3) {
                item.style.display = expanded ? "flex" : "none";
            }
        });

        seeMoreBtn.textContent = expanded ? "See less ▴" : "See more ▾";
    });
}

// ===== Follow / Unfollow =====
function followUser(i) {
    const currentUserId = 1; // demo: login user
    const profileUserId = posts[i].id;

    fetch(`/api/follow-toggle/${profileUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.message);
            posts[i].following = data.following;
            renderPosts();
        })
        .catch((err) => console.error(err));
}

// ===== New Post =====
const postBtn = document.getElementById("postBtn");
if (postBtn) {
    postBtn.addEventListener("click", () => {
        const comment = document.getElementById("newComment").value.trim();
        const imageInput = document.getElementById("newImage").value.trim();
        const image = imageInput || null;

        if (comment) {
            posts.unshift({
                id: Date.now(),
                name: profileName,
                email: localStorage.getItem("userEmail") || "guest@example.com",
                avatar: "https://i.pravatar.cc/50",
                image: image || "",
                comment: comment,
                likes: 0,
                comments: [],
                retweets: 0,
                following: false,
            });

            renderPosts();
            document.getElementById("newComment").value = "";
            document.getElementById("newImage").value = "";
            const preview = document.getElementById("imagePreview");
            if (preview) preview.style.display = "none";
        }
    });
}

// ===== Image Preview =====
const newImageInput = document.getElementById("newImage");
const imagePreview = document.getElementById("imagePreview");
if (newImageInput) {
    newImageInput.addEventListener("input", () => {
        const url = newImageInput.value.trim();
        if (url) {
            imagePreview.src = url;
            imagePreview.style.display = "block";
        } else {
            imagePreview.style.display = "none";
        }
    });
}

// ===== Register Form Handling =====
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Maria", // abhi demo ke liye
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Registration successful! Please login.");
                    window.location.href = "login.html";
                }
            })
            .catch((err) => console.error("Error:", err));
    });
}

// ===== Login Form Handling =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // save session
                    localStorage.setItem("token", "dummy_token");
                    localStorage.setItem("userEmail", data.email);

                    // redirect to home
                    window.location.href = "index.html";
                }
            })
            .catch((err) => console.error("Error:", err));
    });
}


// ===== Start =====
renderPosts();
