import { easy, med, hard, pro } from './words.js';
const display_word = document.querySelector("#word")
const user_input = document.querySelector("input")
const timeleft = document.querySelector("#time")
const score = document.querySelector("#score")
const highscore = document.querySelector("#highscore")
const history = document.querySelector("#history")
const root = document.querySelector(":root")
const themebtn = document.querySelectorAll(".themebtn")
const trybtn = document.querySelector("#trybtn")
const level = document.querySelector("select")
const settingbtn = document.querySelector("#settingbtn")
const applybtn = document.querySelector("#applybtn")
const settings_dialog = document.querySelector(".settings_dialog")
const result = document.querySelector(".gameover_result")
const wpm_msg = document.querySelector("#wpm_msg")
const gameover_mode = document.querySelector("#mode")

const gameover_display = document.querySelector("#gameover_display")
const gameover_display2 = document.querySelector("#gameover_display2")
const gameover_score = document.querySelector("#gameover_score")
const gameover_high = document.querySelector("#gameover_high")

const min = 0
let max = 3061
let wpm
let wpm_time_array = []
let wpm_total_time = 0
let wpm_array = []
let wpm_total_words = 0
let wpm_interval
let wpm_timer = 0
let words = []
let time = 6
let user_score = 0
let flag = 0
let random
let arr = []

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("Easy Mode") == null) {
        localStorage.setItem("Easy Mode", 0)
    }
    if (localStorage.getItem("Medium Mode") == null) {
        localStorage.setItem("Medium Mode", 0)
    }
    if (localStorage.getItem("Hard Mode") == null) {
        localStorage.setItem("Hard Mode", 0)
    }
    if (localStorage.getItem("Pro Mode") == null) {
        localStorage.setItem("Pro Mode", 0)
    }
    if (localStorage.getItem(level.value) != null) {
        highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)}  (Easy)`
    }

    random = Math.floor(Math.random() * (max - min + 1) + min);
    words.push(...easy)
    display_word.innerHTML = words[random]

    level.onchange = function () {
        if (this.value == "Easy Mode") {
            words.length = 0
            max = 3061
            random = Math.floor(Math.random() * (max - min + 1) + min);
            words.push(...easy)
            display_word.innerHTML = words[random]
            highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)} (Easy)`
        }

        if (this.value == "Medium Mode") {
            words.length = 0
            max = 331
            random = Math.floor(Math.random() * (max - min + 1) + min);
            words.push(...med)
            display_word.innerHTML = words[random]
            highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)} (Medium)`
        }

        if (this.value == "Hard Mode") {
            words.length = 0
            max = 340
            random = Math.floor(Math.random() * (max - min + 1) + min);
            words.push(...hard)
            display_word.innerHTML = words[random]
            highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)} (Hard)`
        }
        if (this.value == "Pro Mode") {
            words.length = 0
            max = 92
            random = Math.floor(Math.random() * (max - min + 1) + min);
            words.push(...pro)
            display_word.innerHTML = words[random]
            highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)} (Pro)`
        }
    }

    settingbtn.onclick = () => {
        settings_dialog.showModal()
        settingbtn.innerHTML = "Waiting for User..."
    }
    applybtn.onclick = () => {
        settings_dialog.close()
        settingbtn.innerHTML = level.value
    }


    if (localStorage.getItem("theme") != null) {
        for (let i = 0; i <= 9; i++) {
            if (localStorage.getItem("theme") == themebtn[i].dataset.theme) {
                root.style.setProperty('--bg-color', themebtn[i].dataset.bgcolor)
                root.style.setProperty('--color', themebtn[i].dataset.color)
                root.style.setProperty('--box-shadow', themebtn[i].dataset.boxshadow)
                root.style.setProperty('--backdrop', themebtn[i].dataset.backdrop)
            }
        }
    }
    else {
        root.style.setProperty('--bg-color', themebtn[0].dataset.bgcolor)
        root.style.setProperty('--color', themebtn[0].dataset.color)
        root.style.setProperty('--box-shadow', themebtn[0].dataset.boxshadow)
        root.style.setProperty('--backdrop', themebtn[0].dataset.backdrop)
    }
    themebtn.forEach(button => {
        button.onclick = () => {
            root.style.setProperty('--bg-color', button.dataset.bgcolor)
            root.style.setProperty('--color', button.dataset.color)
            root.style.setProperty('--box-shadow', button.dataset.boxshadow)
            root.style.setProperty('--backdrop', button.dataset.backdrop)
            localStorage.setItem("theme", button.dataset.theme)
        }
    })


    trybtn.onclick = () => {
        time = 5
        user_score = 0;
        user_input.value = ""
        flag = 0
        score.innerHTML = `Score: ${user_score}`
        score.style.color = "black"
        timeleft.innerHTML = `Time: 5 seconds`
        random = Math.floor(Math.random() * (max - min + 1) + min);
        display_word.innerHTML = words[random]
        settingbtn.disabled = false
        settingbtn.style.opacity = "1"
        settingbtn.innerHTML = "Difficulty & Theme Settings"
        result.close()
        gameover_display2.style.display = "none"
        wpm_time_array.length = 0
        wpm_total_words = 0
        let index = level.value.indexOf(" ")
        highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)}  (${level.value.slice(0, index)})`
    }

    user_input.onkeyup = () => {
        settingbtn.disabled = true
        settingbtn.style.opacity = "0.8"
        settingbtn.innerHTML = level.value
        if (flag == 0) {
            wpm_timer = 0
            wpm_total_time = 0
            wpm_interval = setInterval(() => {
                wpm_timer++
            }, 1000);
            let a = setInterval(() => {
                if (time === 0) {
                    for (let x of wpm_time_array) {
                        wpm_total_time += x
                    }
                    wpm = wpm_total_words / (wpm_total_time + 5) * 60
                    gameover_display.innerHTML = "Oops! it's GAME OVER"
                    if (user_score > localStorage.getItem(level.value)) {
                        localStorage.setItem(level.value, user_score)
                        gameover_display2.style.display = "block"
                        highscore.innerHTML = `High Score: ${localStorage.getItem(level.value)}`
                    }
                    gameover_score.innerHTML = `Score: ${user_score}`
                    gameover_high.innerHTML = `High Score: ${localStorage.getItem(level.value)}`
                    wpm_msg.innerHTML = `WPM: ${Math.round(wpm)}`
                    gameover_mode.innerHTML = `(${level.value} Stats)`
                    result.showModal()
                    clearInterval(a);
                    clearInterval(wpm_interval)
                    arr.push(user_score)
                    history.innerHTML = `Past Scores: ${arr}`;
                    history.style.display = "block"
                }
                else {
                    time--;
                    timeleft.innerHTML = `Time: ${time} seconds`
                }
            }, 1000)
        }
        flag++


        if (user_input.value === words[random]) {
            wpm_array = words[random].split(" ")
            wpm_total_words += wpm_array.length
            wpm_time_array.push(wpm_timer)
            wpm_timer = 0
            random = Math.floor(Math.random() * (max - min + 1) + min);
            display_word.innerHTML = words[random]
            user_input.value = ""
            user_score++
            score.innerHTML = `Score: ${user_score}`
            score.style.color = "green"
            score.style.transform = "scale(1.1)"

            time = 6
        }
        else {
            score.style.color = "red"
            score.style.transform = "scale(1)"
        }
    }
})
