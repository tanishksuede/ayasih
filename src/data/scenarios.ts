export const STORY_DATABASE: Record<string, any> = {
    'lvl_age_13_anne_1': {
        background: '/assets/anne-amsterdam-street.png',
        characterRight: '/assets/portrait-anne-frank.png',
        emotion: 'joy',
        frames: [
            {
                id: 'intro',
                bg: '/assets/anne-diary-joy.png',
                speaker: 'Narrator',
                text: "You are Anne Frank, 13 years old, living with your family in Amsterdam. It is your birthday. There are presents around you, family members nearby, and the ordinary concerns of being a teenager: school, friendships, people you like, things that annoy you, things you want to understand and things you do not necessarily want to say aloud. Among your presents is a red-and-white checked diary. You had chosen the diary yourself. Now it is yours. You have a choice about what this private book becomes.",
                emotion: 'joy',
                choices: [
                    {
                        text: 'Keep it private',
                        next: 'choice_a_outcome',
                        score: 1,
                        feedbackTitle: 'Kept Private',
                        feedbackText: 'You value privacy and emotional honesty. You prefer having one safe place where you can be completely yourself without needing anyone else\'s reaction.',
                    },
                    {
                        text: 'Turn it into a record',
                        next: 'choice_b_outcome',
                        score: 1,
                        feedbackTitle: 'Documented',
                        feedbackText: 'You naturally observe the world around you. You look for meaning in ordinary events and tend to preserve experiences rather than simply live through them.',
                    },
                    {
                        text: 'Write creatively',
                        next: 'choice_c_outcome',
                        score: 1,
                        feedbackTitle: 'Creative Space',
                        feedbackText: 'You are drawn toward self-expression and possibility. You would rather explore what you might create than simply record what already happened.',
                    }
                ]
            },
            {
                id: 'choice_a_outcome',
                bg: '/assets/anne-writing.png',
                speaker: 'Narrator',
                text: "Anne received the diary on her 13th birthday and began writing in it shortly afterward. Her early entries discussed her birthday, presents, family, classmates, friends, school and her personal experiences. She addressed the diary as 'Kitty' and used it as a place to confide her thoughts.",
                emotion: 'joy',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'choice_b_outcome',
                bg: '/assets/anne-desk.png',
                speaker: 'Narrator',
                text: "Anne received the diary on her 13th birthday and began writing in it shortly afterward. Her early entries discussed her birthday, presents, family, classmates, friends, school and her personal experiences. She addressed the diary as 'Kitty' and used it as a place to confide her thoughts.",
                emotion: 'joy',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'choice_c_outcome',
                bg: '/assets/anne-diary-smile.png',
                speaker: 'Narrator',
                text: "Anne received the diary on her 13th birthday and began writing in it shortly afterward. Her early entries discussed her birthday, presents, family, classmates, friends, school and her personal experiences. She addressed the diary as 'Kitty' and used it as a place to confide her thoughts.",
                emotion: 'joy',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'lesson',
                bg: '/assets/anne-diary-joy.png',
                speaker: 'Narrator',
                text: "LESSON: A private creative space can matter before anyone else sees its value.\n\nThe meaningful lesson is not 'write because you will become famous.' The documented experience shows something more immediate: at 13, Anne used writing to organize and express her experience of friendships, school, family and everyday life.",
                emotion: 'joy',
                choices: [{ text: 'Complete Level', next: 'COMPLETE', score: 10, feedbackTitle: 'Mission Accomplished' }]
            }
        ]
    },
    'lvl_age_13_anne_2': {
        background: '/assets/anne-annex-room.png',
        characterRight: '/assets/portrait-anne-frank.png',
        emotion: 'fear',
        frames: [
            {
                id: 'intro',
                bg: '/assets/anne-fear.png',
                speaker: 'Narrator',
                text: "You are still 13. But the world outside your home is no longer something you can take for granted. Your sister has received a call-up to report for labour in Germany. Your parents have already prepared a hiding place. The plan changes quickly. On the morning of 6 July 1942, you leave your home with your family and walk toward the hiding place behind your father\'s business. You cannot simply decide to continue your normal school life. You cannot go outside whenever you want. You do not know how long this will last. You have your belongings with you. Among them is the diary you received only weeks earlier.",
                emotion: 'fear',
                choices: [
                    {
                        text: 'Hold tightly to routine',
                        next: 'choice_a_outcome',
                        score: 1,
                        feedbackTitle: 'Maintained Routine',
                        feedbackText: 'You respond to uncertainty by creating structure. When circumstances become uncontrollable, you look for the parts of life you can still organize.',
                    },
                    {
                        text: 'Focus on the people around you',
                        next: 'choice_b_outcome',
                        score: 1,
                        feedbackTitle: 'Observant',
                        feedbackText: 'You respond to uncertainty through relationships. You look outward and try to understand other people before deciding how to act yourself.',
                    },
                    {
                        text: 'Write everything down',
                        next: 'choice_c_outcome',
                        score: 1,
                        feedbackTitle: 'Documented',
                        feedbackText: 'You respond to uncertainty through reflection and documentation. When life becomes difficult to understand, you try to make sense of it by putting it into words.',
                    }
                ]
            },
            {
                id: 'choice_a_outcome',
                bg: '/assets/anne-window.png',
                speaker: 'Narrator',
                text: "Anne went into hiding with her parents and sister on 6 July 1942. Her diary was among the belongings she took with her. In the Secret Annex, she continued writing and also read and studied while the people in hiding were unable to go outside.",
                emotion: 'fear',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'choice_b_outcome',
                bg: '/assets/anne-annex-room.png',
                speaker: 'Narrator',
                text: "Anne went into hiding with her parents and sister on 6 July 1942. Her diary was among the belongings she took with her. In the Secret Annex, she continued writing and also read and studied while the people in hiding were unable to go outside.",
                emotion: 'fear',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'choice_c_outcome',
                bg: '/assets/anne-desk.png',
                speaker: 'Narrator',
                text: "Anne went into hiding with her parents and sister on 6 July 1942. Her diary was among the belongings she took with her. In the Secret Annex, she continued writing and also read and studied while the people in hiding were unable to go outside.",
                emotion: 'fear',
                choices: [{ text: 'Next', next: 'lesson', score: 0 }]
            },
            {
                id: 'lesson',
                bg: '/assets/anne-fear.png',
                speaker: 'Narrator',
                text: "LESSON: Sometimes the most important choice is not about controlling the situation. It is about deciding how you will respond when the situation is no longer yours to control.",
                emotion: 'fear',
                choices: [{ text: 'Complete Level', next: 'COMPLETE', score: 10, feedbackTitle: 'Mission Accomplished' }]
            }
        ]
    },
    // AGE 19: Sachin Tendulkar
    'lvl_age_19_sachin': {
        title: "The Trial of Fire",
        source: "Source: Australia tour 1991-92, Perth Test",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "It is 1992. You are 19 years old. You are in Perth, Australia, facing the most terrifyingly fast bowling attack in the world on a pitch that bounces violently. Senior batters in your team are struggling. A bouncer just hit you flush on the helmet.",
                choices: [
                    {
                        text: "Show no emotion. Stare the bowler down and prepare to attack the next ball, risking your wicket to break their rhythm.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "The Lion's Heart",
                        feedback: "You hit the next ball for a boundary. The Australians are stunned by your absolute fearlessness. You seize the psychological advantage."
                    },
                    {
                        text: "Play defensively. Survive the spell, protect your wicket, and wait for the spinners to come on later.",
                        next: 'defend',
                        score: -5,
                        feedbackTitle: "Surviving is not Thriving",
                        feedback: "It's the logical, safe choice. But the fast bowlers smell blood. They pin you down, dot ball after dot ball, until you eventually edge one to the slips."
                    }
                ]
            },
            {
                id: 'defend',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You lost your wicket cheaply. The team is collapsing. You realize that against greatness, playing safe is the biggest risk of all.",
                choices: [
                    {
                        text: "Go to the nets. Face extreme pace without a helmet until you stop flinching.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "Confronting Fear",
                        feedback: "You force yourself to find comfort in the danger zone."
                    },
                    {
                        text: "Accept that Australian pitches are just too hostile and wait for the home series.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "The Comfort Zone",
                        feedback: "You become a good player at home, but never a global legend."
                    }
                ]
            },
            {
                id: 'attack',
                emotion: 'triumph',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You are dominating the world's best. You are nearing a historic century. But the tail-end batsmen are falling quickly. You might run out of partners before you reach 100.",
                choices: [
                    {
                        text: "Farm the strike. Take singles on the last ball to protect the tailenders, slowing your own scoring rate.",
                        next: 'century',
                        score: 10,
                        feedbackTitle: "The General",
                        feedback: "You take responsibility. You shield your weaker partners, slowly inching towards history while frustrating the opposition."
                    },
                    {
                        text: "Try to hit every ball for a boundary to get your 100 before the last man gets out.",
                        next: 'selfish',
                        score: -5,
                        feedbackTitle: "The Glory Shot",
                        feedback: "You play a rash shot and get caught in the deep on 98. The team gets bowled out in the same over."
                    }
                ]
            },
            {
                id: 'selfish',
                emotion: 'triumph',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "You missed the milestone because you rushed the process. True mastery requires infinite patience in the final stretch.",
                choices: [
                    {
                        text: "Re-focus. Value the team's total over your personal milestone.",
                        next: 'century',
                        score: 10,
                        feedbackTitle: "Maturing",
                        feedback: "You learn that the milestones will come if you focus purely on the process of the game."
                    }
                ]
            },
            {
                id: 'century',
                emotion: 'triumph',
                bg: '/assets/avatar_sachin.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You score 114 at Perth, one of the greatest hundreds ever seen in Australia. The world realizes a 19-year-old boy is the best batsman on the planet.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_sachin.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You stepped back when history demanded you step up.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SACHIN',
                emotion: 'triumph',
                bg: '/assets/bg_sachin_perth.jpg',
                text: "LESSON: Courage. When placed in an incredibly hostile environment, playing defensively guarantees failure. True greats attack their extreme fears.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Sundar Pichai
    'lvl_age_19_sundar': {
        title: "The Divided Mind",
        source: "Source: Days at IIT Kharagpur",
        frames: [
            {
                id: 'intro',
                emotion: 'tension',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You are 19. You are a student at IIT Kharagpur studying Metallurgical Engineering. The academic pressure is suffocating. You are fascinated by computers, but there are only a few slow terminals on campus, and using them takes time away from your core coursework.",
                choices: [
                    {
                        text: "Focus entirely on Metallurgy. Maximize your GPA to ensure a safe, high-paying engineering job.",
                        next: 'metallurgy',
                        score: -5,
                        feedbackTitle: "The Safe Route",
                        feedback: "You graduate with top honors, but you enter a dying industrial field, completely missing the digital revolution."
                    },
                    {
                        text: "Sacrifice sleep and risk your grades. Spend nights in the computer lab reading about the nascent internet.",
                        next: 'computers',
                        score: 10,
                        feedbackTitle: "The Explorer",
                        feedback: "Your grades slip slightly, but you discover a profound, obsessive love for software and global connectivity."
                    }
                ]
            },
            {
                id: 'metallurgy',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You ace your tests, but you feel intellectually hollow. You see your friends discussing code and feel left behind.",
                choices: [
                    {
                        text: "Accept that your GPA is more important than a hobby.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Following the Herd",
                        feedback: "You play it safe. Your impact on the world remains limited."
                    },
                    {
                        text: "Pivot. Start balancing your required studies with self-taught computing.",
                        next: 'computers',
                        score: 10,
                        feedbackTitle: "The Pivot",
                        feedback: "It's exhausting, but learning a discipline outside your mandate expands your worldview."
                    }
                ]
            },
            {
                id: 'computers',
                emotion: 'hope',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You want to study abroad to dive deeper into technology, but your family in Chennai cannot afford a plane ticket to America, let alone the tuition.",
                choices: [
                    {
                        text: "Take a loan, apply for scholarships, and endure the brutal uncertainty of the process.",
                        next: 'stanford',
                        score: 10,
                        feedbackTitle: "Skin in the Game",
                        feedback: "Your father withdraws his entire life savings just to buy your flight ticket. The sheer weight of that sacrifice fuels an unbreakable discipline in you."
                    },
                    {
                        text: "Stay in India. The financial burden and risk to your family are simply too high to justify.",
                        next: 'fail_india',
                        score: -5,
                        feedbackTitle: "Noble, but Limiting",
                        feedback: "You protect your family's finances short-term, but sacrifice the environment needed to maximize your potential."
                    }
                ]
            },
            {
                id: 'fail_india',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "You take a local job. You do well, but you always wonder what if you had taken the leap.",
                choices: [
                    {
                        text: "Re-evaluate. Take the risk while you are young.",
                        next: 'stanford',
                        score: 10,
                        feedbackTitle: "Taking the Leap",
                        feedback: "You realize true growth lies on the other side of terrifying financial and geographical risks."
                    }
                ]
            },
            {
                id: 'stanford',
                emotion: 'hope',
                bg: '/assets/avatar_sundar.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You make it to Stanford. Decades later, your quiet obsession with computing leads you to build Google Chrome, and eventually become the CEO of Alphabet.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_sundar.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You stayed safe. But the world belonged to the curious.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SUNDAR',
                emotion: 'hope',
                bg: '/assets/bg_sundar_iit.jpg',
                text: "LESSON: Curiosity. The system rewards those who follow the rules, but history rewards those who risk their comfort to explore what fascinates them outside the syllabus.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Shah Rukh Khan
    'lvl_age_19_srk': {
        title: "A Stage For Grief",
        source: "Source: Theatre Action Group (TAG) Delhi, early years",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "You are 19. You live in Delhi. Your father just passed away unexpectedly, leaving your family in a precarious financial state. Despite doing well in Economics at Hansraj College, all you want to do is perform in the local theatre.",
                choices: [
                    {
                        text: "Take a steady, boring office job to support your grieving mother and sister immediately.",
                        next: 'office',
                        score: -5,
                        feedbackTitle: "The Responsible Trap",
                        feedback: "It is the honorable thing to do. However, the soul-crushing routine quietly extinguishes your massive creative energy."
                    },
                    {
                        text: "Keep doing unpaid theatre. Channel your immense grief, anger, and manic energy entirely into your acting.",
                        next: 'theatre',
                        score: 10,
                        feedbackTitle: "The Alchemy of Pain",
                        feedback: "You have very little money, but on stage under Barry John's direction, your pain transforms into an electric, magnetic aura."
                    }
                ]
            },
            {
                id: 'office',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "You are making money, but you are miserable. You realize you can't protect your family if you are dead inside.",
                choices: [
                    {
                        text: "Accept this life as your duty.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Faded Lights",
                        feedback: "You become another anonymous worker in a massive city."
                    },
                    {
                        text: "Quit the job. Return to the theatre stage where you belong.",
                        next: 'theatre',
                        score: 10,
                        feedbackTitle: "The Rightful Place",
                        feedback: "You step back onto the stage. The energy returns immediately."
                    }
                ]
            },
            {
                id: 'theatre',
                emotion: 'hope',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "Your performances are brilliant but unorthodox. A television director notices you and offers you a role in a show called 'Fauji'. The pay is okay, but television is looked down upon by pure theatre artists who want to do cinema.",
                choices: [
                    {
                        text: "Reject the TV role holding out for a glamorous cinema debut.",
                        next: 'cinema_wait',
                        score: -5,
                        feedbackTitle: "Ego Over Opportunity",
                        feedback: "You wait years for a film offer that never comes. You starve while waiting for the 'perfect' break."
                    },
                    {
                        text: "Take the TV role. Give it 200% effort, treating it like it's an Academy Award-winning film.",
                        next: 'tv_success',
                        score: 10,
                        feedbackTitle: "There Are No Small Roles",
                        feedback: "Your intense, manic performance as Abhimanyu Rai makes you a nationwide sensation overnight."
                    }
                ]
            },
            {
                id: 'cinema_wait',
                emotion: 'hope',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "Waiting for the perfect launch vehicle is pointless if no one knows who you are.",
                choices: [
                    {
                        text: "Call the TV director back and swallow your pride.",
                        next: 'tv_success',
                        score: 10,
                        feedbackTitle: "Hustle",
                        feedback: "You take the opportunity in front of you instead of the one in your head."
                    }
                ]
            },
            {
                id: 'tv_success',
                emotion: 'hope',
                bg: '/assets/avatar_srk.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your television success propels you to Mumbai. With zero film connections and immense hustle, you go on to conquer Bollywood and become its undisputed King.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_srk.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The fire inside you was put out by pragmatism.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SRK',
                emotion: 'hope',
                bg: '/assets/bg_srk_delhi.jpg',
                bgPosition: 'object-top',
                text: "LESSON: Passion. When dealing with immense pain, the logical choice is to seek safety. The extraordinary choice is to channel that devastation into an undeniable, obsessive drive for your craft.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
    // AGE 18: Virat Kohli
    'lvl_age_18_kohli': {
        title: "The King's Promise",
        source: "Source: Delhi vs Karnataka, Ranji Trophy 2006",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_virat_pavilion.jpg',
                text: "December 19, 2006. You are 18. You are batting overnight on 40 for Delhi in a crucial Ranji Trophy match against Karnataka. Your team is struggling and staring at a follow-on. At 3 AM, your father passes away from a stroke.",
                choices: [
                    {
                        text: "Stay home and mourn. Family first.",
                        next: 'stay_home',
                        score: -10,
                        feedbackTitle: "Understandable, but ordinary",
                        feedback: "Everyone expected you to stay. It's the normal thing to do. Your team loses the match, and cricket takes a back seat for years."
                    },
                    {
                        text: "Go to the stadium and bat. Save the team.",
                        next: 'go_bat',
                        score: 10,
                        feedbackTitle: "The Defining Moment",
                        feedback: "Your coach and teammates are shocked to see you. You pad up in silence. You know this is what your father wanted for you."
                    }
                ]
            },
            {
                id: 'stay_home',
                bg: '/assets/bg_virat_pavilion.jpg',
                text: "You stayed back. The grief is overwhelming. A month later, you return to the nets, but the fire isn't the same.",
                choices: [
                    {
                        text: "Push yourself harder to make him proud.",
                        next: 'go_bat',
                        score: 10,
                        feedbackTitle: "Redemption",
                        feedback: "You realize he wouldn't want you to quit. You get back to the grind."
                    },
                    {
                        text: "It's too much pressure. Focus on a normal job.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "A Faded Dream",
                        feedback: "Not everyone is built to absorb that kind of tragedy and turn it into fuel."
                    }
                ]
            },
            {
                id: 'go_bat',
                emotion: 'determination',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "You walk out to the middle. The opposition is fierce, knowing your mental state. Every ball is a test of your focus.",
                choices: [
                    {
                        text: "Play aggressively. Let the anger out.",
                        next: 'aggressive',
                        score: -5,
                        feedbackTitle: "Lost Control",
                        feedback: "You hit a few boundaries but throw your wicket away in anger. The team still loses."
                    },
                    {
                        text: "Block the noise. Focus entirely on the ball. Play a disciplined innings.",
                        next: 'disciplined_90',
                        score: 10,
                        feedbackTitle: "The Anchor",
                        feedback: "You batted for almost 5 hours. You scored a match-saving 90 runs. The umpires called it off due to bad light."
                    }
                ]
            },
            {
                id: 'aggressive',
                emotion: 'determination',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "Your anger clouded your judgment. But your resolve is noted by the selectors.",
                choices: [
                    {
                        text: "Accept the mistake and focus on control next time.",
                        next: 'disciplined_90',
                        score: 10,
                        feedbackTitle: "Growth Mindset",
                        feedback: "Channeling aggression into discipline is what separates the good from the great."
                    }
                ]
            },
            {
                id: 'disciplined_90',
                emotion: 'determination',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "After you were controversially given out on 90, you saved Delhi from the follow-on. Only after the day's play did you go straight to your father's cremation.",
                choices: [
                    {
                        text: "Acknowledge the defining day of your life.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "A Boy Became a Man",
                        feedback: "That day changed you. The boy who loved to party became obsessed with fitness, discipline, and winning. You became The King."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'hope',
                bg: '/assets/avatar_virat_kohli.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "From that day on, you never compromised on cricket. You went on to lead India to historic victories globally.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                bg: '/assets/avatar_virat_kohli.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your journey diverged from greatness. The pain was too great a burden.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_VIRAT',
                emotion: 'determination',
                bg: '/assets/bg_virat_pitch.jpg',
                text: "LESSON: Resilience. When personal tragedy strikes, the greats channel their pain into their craft, transforming grief into unwavering focus.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Dr. A.P.J. Abdul Kalam
    'lvl_age_18_kalam': {
        title: "The Big Leap",
        source: "Source: 'Wings of Fire', Autobiography",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_kalam_college.jpg',
                text: "It is 1949. You are 18. You've arrived at St. Joseph's College in Tiruchirappalli from the small temple town of Rameswaram. You used to deliver newspapers. Now, you are surrounded by wealthy, English-speaking, city-bred students.",
                choices: [
                    {
                        text: "Hide in your room. Try not to be noticed.",
                        next: 'hide',
                        score: -10,
                        feedbackTitle: "Inferiority Complex",
                        feedback: "You let your background dictate your worth. You pass your classes but remain unremarkable."
                    },
                    {
                        text: "Embrace the library. Your intellect is your true equalizer.",
                        next: 'library',
                        score: 10,
                        feedbackTitle: "The Seeker",
                        feedback: "You realize that physics doesn't care if you speak perfect English. You dive deep into textbooks."
                    }
                ]
            },
            {
                id: 'hide',
                bg: '/assets/bg_kalam_college.jpg',
                text: "You feel invisible. Your grades are suffering because you are too afraid to ask questions in class.",
                choices: [
                    {
                        text: "Gather courage and approach a professor for help.",
                        next: 'library',
                        score: 10,
                        feedbackTitle: "Breaking the Shell",
                        feedback: "Rev. Father Iyadurai is impressed by your curiosity and takes you under his wing."
                    },
                    {
                        text: "Give up and return to Rameswaram.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "Retreat",
                        feedback: "You go back. India loses a visionary."
                    }
                ]
            },
            {
                id: 'library',
                emotion: 'determination',
                bg: '/assets/bg_kalam_college.jpg',
                text: "Your dedication is absolute. Your roommate, reading a novel, asks you to take a break and go to town.",
                choices: [
                    {
                        text: "Go to town. Socializing is important too.",
                        next: 'distraction',
                        score: -5,
                        feedbackTitle: "Lost Focus",
                        feedback: "It's fine to relax, but you lose precious hours reviewing a complex aerodynamics concept."
                    },
                    {
                        text: "Politely decline. Let's finish this chapter on subatomic physics first.",
                        next: 'focus_physics',
                        score: 10,
                        feedbackTitle: "Laser Focus",
                        feedback: "Your professors notice your relentless curiosity. You aren't just memorizing; you are understanding the universe."
                    }
                ]
            },
            {
                id: 'distraction',
                bg: '/assets/bg_kalam_college.jpg',
                text: "You enjoyed the evening, but tomorrow's test hits you hard. You realize time is the only asset you have.",
                choices: [
                    {
                        text: "Double down on studying tonight to catch up.",
                        next: 'focus_physics',
                        score: 10,
                        feedbackTitle: "Correction",
                        feedback: "You bounce back. It's about how you recover."
                    }
                ]
            },
            {
                id: 'focus_physics',
                emotion: 'determination',
                bg: '/assets/bg_kalam_college.jpg',
                text: "Through pure grit, you excel. A visiting professor talks about a new field: Aeronautics. Your eyes light up.",
                choices: [
                    {
                        text: "Decide right then that you will build planes.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Dream is Born",
                        feedback: "From a boy selling newspapers on a train platform, you set your sights on the sky."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_apj_kalam.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You eventually go to Madras Institute of Technology. You go on to build India's first satellite launch vehicle and serve as the People's President.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'determination',
                bg: '/assets/avatar_apj_kalam.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The intimidation of the city was too much. The dream ended before it began.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_KALAM',
                emotion: 'determination',
                bg: '/assets/bg_kalam_college.jpg',
                text: "LESSON: Self-Belief. Your current circumstances or background do not define your potential. Knowledge is the ultimate equalizer.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Ratan Tata
    'lvl_age_18_tata': {
        title: "The Defiant Blueprint",
        source: "Source: Ratan Tata's early life interviews",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "It is 1955. You are an 18-year-old Ratan Tata. You have just arrived at Cornell University in New York. Your father strongly expects you to study Engineering and join the family business.",
                choices: [
                    {
                        text: "Follow your father's wishes. Enroll in Engineering.",
                        next: 'engineering',
                        score: -10,
                        feedbackTitle: "Dutiful, but Hollow",
                        feedback: "You study engineering, but your heart isn't in it. You become a capable manager, but lack creative vision."
                    },
                    {
                        text: "Refuse. Enroll secretly in Architecture, your true passion.",
                        next: 'architecture',
                        score: 10,
                        feedbackTitle: "The Rebel Heir",
                        feedback: "You risk your father's wrath. You want to design, to build structures with empathy and aesthetic."
                    }
                ]
            },
            {
                id: 'engineering',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "Engineering classes feel like a chore. You find yourself sketching buildings in the margins of your thermodynamics notes.",
                choices: [
                    {
                        text: "Make the bold switch to Architecture now.",
                        next: 'architecture',
                        score: 10,
                        feedbackTitle: "Better Late",
                        feedback: "You finally gather the courage to follow your own path."
                    },
                    {
                        text: "Stay the course. Don't rocking the boat.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "A Life Unlived",
                        feedback: "You conform. The fire inside you slowly dies."
                    }
                ]
            },
            {
                id: 'architecture',
                emotion: 'fear',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "You switch to architecture. When your father finds out, he is furious. He cuts off significant financial support.",
                choices: [
                    {
                        text: "Apologize and switch back to Engineering.",
                        next: 'engineering',
                        score: -10,
                        feedbackTitle: "Yielding to Pressure",
                        feedback: "You chose financial security over your passion."
                    },
                    {
                        text: "Work odd jobs in the US to support yourself. Stick to your choice.",
                        next: 'odd_jobs',
                        score: 10,
                        feedbackTitle: "Independence",
                        feedback: "You wash dishes. You learn the dignity of labor. You realize you don't need the Tata name to survive."
                    }
                ]
            },
            {
                id: 'odd_jobs',
                emotion: 'fear',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "You graduate with a degree in Architecture. Your grandmother, Navajbai, is proud of your independence.",
                choices: [
                    {
                        text: "Now that you have your degree, chart your own path.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Authentic Leader",
                        feedback: "The design thinking and structural empathy you learned in architecture later became your superpower when leading the vast Tata conglomerate."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'fear',
                bg: '/assets/avatar_ratan_tata.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You returned to India and eventually led the Tata Group, launching the Indica, acquiring JLR, and operating with deep empathy.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'fear',
                bg: '/assets/avatar_ratan_tata.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You lived a comfortable life, but always wondered what you could have built.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_TATA',
                emotion: 'fear',
                bg: '/assets/bg_tata_cornell.jpg',
                text: "LESSON: Authenticity. Defying expectations to follow your true passion is painful, but it gives you a unique perspective that conformity never could.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
    // AGE 18: Taylor Swift (The Artist)
    'lvl_age_18': {
        title: "The Nashville Choice",
        source: "Source: 'Taylor Swift: The Life of a Songwriter' & Rolling Stone Interviews.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_taylor_cafe.png',
                text: "It's 2008. You are 15 (but let's say 18 for game flow). You're sitting in the Bluebird Cafe in Nashville. Scott Borchetta from a new indie label 'Big Machine' is watching you.",
                choices: [
                    {
                        text: "Play a cover of a popular hit.",
                        next: 'safe_route',
                        score: -10,
                        feedbackTitle: "Just Another Singer",
                        feedback: "Scott is looking for a unique voice, not a karaoke machine. Playing it safe gets you nowhere in art."
                    },
                    {
                        text: "Play your original song 'Tim McGraw'.",
                        next: 'risk_route',
                        score: 10,
                        feedbackTitle: "Bold Move",
                        feedback: "Yes! You bet on your own songwriting. Scott is captivated by your storytelling."
                    }
                ]
            },
            {
                id: 'safe_route',
                bg: '/assets/bg_taylor_studio.png',
                text: "You sound great, but you sound like everyone else. Scott leaves early. You finish high school and wonder 'what if'.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'risk_route',
                emotion: 'hope',
                bg: '/assets/bg_taylor_studio.png',
                text: "Scott offers you a deal, but it's a tiny label with no money. RCA Records also wants you, but they want you to sing other people's songs.",
                choices: [
                    {
                        text: "Take the RCA deal. They have money!",
                        next: 'rca_fail',
                        score: -10,
                        feedbackTitle: "Golden Handcuffs",
                        feedback: "You sign with RCA. They shelf you for 2 years because they 'don't know what to do with you'. Authenticity matters more than budget."
                    },
                    {
                        text: "Sign with Scott/Big Machine.",
                        next: 'tour_grind',
                        score: 10,
                        feedbackTitle: "Creative Control",
                        feedback: "Smart. You chose the partner who let you write your own music, even if they had less cash."
                    }
                ]
            },
            {
                id: 'rca_fail',
                emotion: 'hope',
                bg: '/assets/bg_taylor_studio.png',
                text: "You sign with RCA. They shelf you for 2 years because they 'don't know what to do with you'. Authenticity matters more than budget.",
                choices: [
                    { text: "Try Again", next: 'risk_route', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'tour_grind',
                emotion: 'hope',
                bg: '/assets/bg_taylor_bus.png',
                text: "The album is out. It's doing okay, but you need more fans. Radio stations are the gatekeepers.",
                choices: [
                    {
                        text: "Send mass emails to DJs.",
                        next: 'email_fail',
                        score: -5,
                        feedbackTitle: "Impersonal",
                        feedback: "It's efficient, but easily ignored. In the ending of the day, people buy from people."
                    },
                    {
                        text: "Go on a 6-month radio tour. Bake cookies for DJs.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Hustle",
                        feedback: "Legendary. Taylor visited every single radio station, remembered their kids' names, and baked them cookies. They played her song because they loved HER."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'hope',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Tim McGraw hits the Billboard Hot 100. You are on your way to becoming the biggest star in the world.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'hope',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUTHENTICITY. Taylor Swift didn't have the best voice or the most money. She had her own stories and a relentless work ethic. Bet on your unique voice.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Mark Zuckerberg (The Visionary)
    'lvl_age_19': {
        title: "The Dropout Dilemma",
        source: "Source: 'The Facebook Effect' by David Kirkpatrick.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_zuck_dorm.png',
                text: "It's 2004. You are 19. Harvard classes are getting in the way of your side project, 'TheFacebook'. It's growing too fast.",
                choices: [
                    {
                        text: "Focus on grades. Harvard is prestigious!",
                        next: 'grades_fail',
                        score: -10,
                        feedbackTitle: "Missed the Wave",
                        feedback: "Friendster and MySpace would have crushed you. Timing is everything in tech."
                    },
                    {
                        text: "Move to Palo Alto for the summer.",
                        next: 'palo_alto',
                        score: 10,
                        feedbackTitle: "All In",
                        feedback: "Correct. Mark knew he needed to be where the investors and engineers were."
                    }
                ]
            },
            {
                id: 'palo_alto',
                bg: '/assets/bg_zuck_pool.png',
                text: "You're renting a house with Sean Parker. Yahoo offers to buy you for $1 Billion. Everyone tells you to take it.",
                choices: [
                    {
                        text: "Take the $1 Billion!",
                        next: 'sell_out',
                        score: -10,
                        feedbackTitle: "Short Term Thinking",
                        feedback: "You're rich, but you're not the King. Someone else builds the future of communication."
                    },
                    {
                        text: "Refuse. We're building a network, not a flip.",
                        next: 'growth',
                        score: 10,
                        feedbackTitle: "Conviction",
                        feedback: "History was made. Mark famously walked out of the meeting because he knew the potential was trillions, not billions."
                    }
                ]
            },
            {
                id: 'growth',
                emotion: 'tension',
                bg: '/assets/scenario_office.jpg',
                text: "You kept control. Now you need to hire. A brilliant engineer comes in, but he's wearing pajamas to the interview.",
                choices: [
                    {
                        text: "Don't hire. Unprofessional.",
                        next: 'culture_fail',
                        score: -10,
                        feedbackTitle: "Old School",
                        feedback: "In Silicon Valley, code wins arguments, not suits. You missed a 10x engineer."
                    },
                    {
                        text: "Hire him. Check his code.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Meritocracy",
                        feedback: "You built a culture where ability mattered more than appearance. Facebook shipped faster than anyone else."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'tension',
                bg: '/assets/zuck_happy.jpg',
                text: "The network hits 500 million users. You connected the world.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'tension',
                bg: '/assets/zuck_happy.jpg',
                text: "LESSON: CONVICTION. When you have data that the world doesn't see yet, you have to trust it. Even when a billion dollars is on the table.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },



    // AGE 20 (Music): Taylor Swift (The Solo Experiment)
    'lvl_age_20_music': {
        title: "The Solo Experiment",
        source: "Source: 'Speak Now' Album Liner Notes & Rolling Stone.",
        frames: [
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg_taylor_awards.png',
                bgPosition: 'object-right',
                text: "It's 2010. You are 20. Critics are saying you don't write your own songs and that you rely on Nashville pros.",
                choices: [
                    {
                        text: "Play it safe. Hire top co-writers.",
                        next: 'safe_bet',
                        score: -10,
                        feedbackTitle: "Safety Net",
                        feedback: "You make a great album, but the whispers never stop. 'She's just a puppet.'"
                    },
                    {
                        text: "Write the entire album 100% alone.",
                        next: 'solo_write',
                        score: 10,
                        feedbackTitle: "Bold Move",
                        feedback: "You lock yourself in your room. No co-writers. Just you and the guitar."
                    }
                ]
            },
            {
                id: 'safe_bet',
                bg: '/assets/bg_taylor_room.png',
                text: "The album travels well, but you feel like you haven't proved yourself.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'solo_write',
                emotion: 'triumph',
                bg: '/assets/bg_taylor_room.png',
                text: "It's lonely and hard. You have no one to bounce ideas off of. But the songs are brutally honest.",
                choices: [
                    {
                        text: "Ask a producer to tweak the lyrics.",
                        next: 'compromise',
                        score: -5,
                        feedbackTitle: "Doubt",
                        feedback: "It would help, but it ruins the point of the experiment."
                    },
                    {
                        text: "Trust your own pen. Submit it as is.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Self-Belief",
                        feedback: "'Speak Now' becomes a classic. Hand-written by Taylor Swift. The critics are silenced."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'triumph',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You win 2 Grammys for the album. You proved that your voice is yours alone.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'triumph',
                bg: '/assets/avatar_taylor_swift.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUTONOMY. Sometimes the only way to kill impostor syndrome is to do the hard thing completely on your own.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Sports): Kobe Bryant (The Mamba)
    'lvl_age_20_sports': {
        title: "The 4 AM Club",
        source: "Source: 'The Mamba Mentality' by Kobe Bryant.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_kobe_court.png',
                bgPosition: 'object-left',
                text: "It's 1998. You are 20. You play for the Lakers. The team is going out to a club in LA to celebrate a win.",
                choices: [
                    {
                        text: "Go with them. Team bonding!",
                        next: 'party',
                        score: -10,
                        feedbackTitle: "Distraction",
                        feedback: "You had fun, but you missed practice the next morning. Greatness requires sacrifice."
                    },
                    {
                        text: "Go to the gym. 4 AM workout.",
                        next: 'gym',
                        score: 10,
                        feedbackTitle: "Discipline",
                        feedback: "While they slept, you worked. You made 400 shots before sunrise."
                    }
                ]
            },
            {
                id: 'party',
                bg: '/assets/bg_kobe_club.png',
                text: "You wake up hungover. Coach Del Harris benches you for being sluggish.",
                choices: [
                    { text: "Restart", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'gym',
                bg: '/assets/bg_kobe_gym.png',
                text: "Your teammates arrive at 10 AM, groggy. You've already done a full workout. A reporter asks why you work so hard.",
                choices: [
                    {
                        text: "To be better than Shaq.",
                        next: 'rivalry',
                        score: -5,
                        feedbackTitle: "Comparison",
                        feedback: "Competition is good, but the real battle is with yourself."
                    },
                    {
                        text: "To see what I'm capable of.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Mastery",
                        feedback: "You didn't cheat the grind. That's why you became a legend."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_kobe.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You win 5 Championships. The world calls it talent. You know it was the 4 AMs.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_kobe.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: DISCIPLINE. Talent is common. What separates the greats is the willingness to do the boring, hard work when no one is watching.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Education): NV Sir (The Mentor)
    'lvl_age_20_nv_sir': {
        title: "The Educator's Dilemma",
        source: "Source: NV Sir's Life Journey.",
        frames: [
            {
                id: 'intro',
                emotion: 'tension',
                bg: '/assets/bg_nv_sir_family.jpg',
                bgPosition: 'object-center',
                text: "Your family needs financial support NOW. Your IIT degree is 2 years away. A relative offers you a part-time BPO night shift job — ₹8,000/month, stable. A local school offers you a teaching gig — ₹2,000/month, uncertain.",
                choices: [
                    {
                        text: "Take the BPO job — stable money, family relieved immediately.",
                        next: 'bpo_job',
                        score: -10,
                        feedbackTitle: "Responsible but Stagnant",
                        feedback: "You helped your family, but the night shifts drained your energy. You never finished IIT or pursued your true passion."
                    },
                    {
                        text: "Take the teaching job despite lower pay.",
                        next: 'teaching_job',
                        score: 10,
                        feedbackTitle: "Gut Feeling",
                        feedback: "You followed your passion for physics. The pay was low, but you discovered a natural gift for connecting with students."
                    },
                    {
                        text: "Ask family to manage 2 more years, focus 100% on degree.",
                        next: 'degree_only',
                        score: -5,
                        feedbackTitle: "Long-term bet",
                        feedback: "While practical, life doesn't always wait. Sometimes you need to build your skills while earning."
                    },
                    {
                        text: "Take both jobs + college — grind everything at once.",
                        next: 'burnout',
                        score: -5,
                        feedbackTitle: "Maximum hustle",
                        feedback: "Burnout hits hard within 3 months. Quality in teaching drops, and grades suffer."
                    }
                ]
            },
            {
                id: 'bpo_job',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "The stability feels good initially, but you realize you are sacrificing your long-term potential.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'degree_only',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "The financial strain is too much. You realize you have to do something now.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'burnout',
                bg: '/assets/bg_nv_sir_family.jpg',
                text: "You can't do it all. You have to choose where to focus your extra time.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'teaching_job',
                emotion: 'determination',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "The only good coaching institute that'll hire you is 44 km away. Your friend says 'bro just tutor 5 kids at home, you'll earn the same with zero travel.' Your senior says 'that institute has 200 students — your career will explode if you crack it.'",
                choices: [
                    {
                        text: "Home tuitions — same money, zero commute, more sleep.",
                        next: 'home_tuition',
                        score: -5,
                        feedbackTitle: "Smart & Practical",
                        feedback: "Comfortable, but limits your growth. You never build the large-scale impact you were meant for."
                    },
                    {
                        text: "Do the 44 km daily — bet on the bigger stage.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Risk it",
                        feedback: "You endure the grueling commute. Standing in front of 200 students pushes you to become a master communicator. Your reputation skyrockets."
                    },
                    {
                        text: "Apply to closer institutes first, commute only if nothing works.",
                        next: 'delay',
                        score: -5,
                        feedbackTitle: "Logical Backup",
                        feedback: "The closer institutes don't have the same caliber of students or mentors. Your growth is slow."
                    },
                    {
                        text: "Delay teaching, focus on cracking campus placement instead.",
                        next: 'safe_exit',
                        score: -10,
                        feedbackTitle: "Safe Exit",
                        feedback: "You get a software job, but you always wonder what could have happened if you nurtured your teaching talent."
                    }
                ]
            },
            {
                id: 'home_tuition',
                emotion: 'determination',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "You earn decent money, but your impact remains small.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'delay',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "The delay costs you valuable momentum and exposure.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'safe_exit',
                emotion: 'determination',
                bg: '/assets/bg_nv_sir_teaching.jpg',
                text: "You chose safety over passion, missing out on your true calling.",
                choices: [
                    { text: "Try Again", next: 'teaching_job', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_nv_sir.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black', // add black bg fill
                text: "Your dedication pays off. You become a legendary physics teacher, eventually founding your own massive education platform.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'determination',
                bg: '/assets/avatar_nv_sir.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black', // add black bg fill
                text: "LESSON: LONG-TERM VISION. True growth often requires sacrificing short-term comfort for a larger platform and greater impact. Bet on your potential.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Art): Frida Kahlo (The Icon)
    'lvl_age_20_art': {
        title: "The Broken Column",
        source: "Source: 'Frida: A Biography of Frida Kahlo'.",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_frida_bed.png',
                bgPosition: 'object-left',
                text: "It's 1927. You are 20. A bus accident shattered your spine. You are stuck in a body cast in bed for months.",
                choices: [
                    {
                        text: "Stare at the ceiling and cry.",
                        next: 'despair',
                        score: -10,
                        feedbackTitle: "Passive",
                        feedback: "The pain consumed you. You lost your spark."
                    },
                    {
                        text: "Ask for a mirror and paints.",
                        next: 'paint',
                        score: 10,
                        feedbackTitle: "Expression",
                        feedback: "Your mother installed a mirror above your bed. You became your own muse."
                    }
                ]
            },
            {
                id: 'despair',
                bg: '/assets/bg_frida_bed.png',
                bgPosition: 'object-right',
                text: "The days blend together. You lose hope.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'paint',
                emotion: 'wonder',
                bg: '/assets/bg_frida_painting.png',
                text: "You paint your pain. It's raw and weird. Critics might find it too personal.",
                choices: [
                    {
                        text: "Paint pretty flowers instead.",
                        next: 'safe_art',
                        score: -10,
                        feedbackTitle: "Conformity",
                        feedback: "Pretty pictures are forgettable. Your truth is what makes you Frida."
                    },
                    {
                        text: "Paint the blood and the tears.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Authenticity",
                        feedback: "You turned tragedy into art. The world had never seen anything so honest."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'wonder',
                bg: '/assets/avatar_frida.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your work shocks and amazes the world. You become an icon of strength.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'wonder',
                bg: '/assets/avatar_frida.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: RESILIENCE. You can't control what happens to you (the accident), but you can control what you create from it. Turn your pain into power.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Bill Gates (The Architect) - Default/Tech
    'lvl_age_20': {
        title: "The Software Gamble",
        source: "Source: 'Hard Drive: Bill Gates and the Making of the Microsoft Empire'.",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_gates_dorm.png',
                bgPosition: 'object-left',
                text: "It's 1975. You are 20. You see the Altair 8800 on the cover of Popular Electronics. It's the first 'Personal Computer'.",
                choices: [
                    {
                        text: "Wait until you graduate Harvard.",
                        next: 'too_late',
                        score: -10,
                        feedbackTitle: "Hesitation",
                        feedback: "By the time you graduated, the OS market would have been cornered by CP/M."
                    },
                    {
                        text: "Call MITS and say you have an interpreter.",
                        next: 'bluff',
                        score: 10,
                        feedbackTitle: "Aggressive Action",
                        feedback: "You didn't actually have the software yet! But you committed, then worked day and night to build it."
                    }
                ]
            },
            {
                id: 'bluff',
                bg: '/assets/bg_gates_dorm.png',
                text: "They want a demo in 3 weeks. You have nothing written. You and Paul Allen ignore all your classes.",
                choices: [
                    {
                        text: "Sleep 8 hours a day to stay fresh.",
                        next: 'slow_fail',
                        score: -5,
                        feedbackTitle: "Balanced but Slow",
                        feedback: "Healthy, but start-up sprints sometimes require unhealthy bursts of intensity."
                    },
                    {
                        text: "Code until you pass out at the keyboard.",
                        next: 'ibm_deal',
                        score: 10,
                        feedbackTitle: "Obsession",
                        feedback: "Bill famously fell asleep on his keyboard, woke up, and kept typing. That intensity won the race."
                    }
                ]
            },
            {
                id: 'ibm_deal',
                emotion: 'tension',
                bg: '/assets/bg_gates_boardroom.png',
                text: "Microsoft is growing. IBM comes knocking. They need an OS for their new PC. You don't have one.",
                choices: [
                    {
                        text: "Tell them you can't help.",
                        next: 'missed_boat',
                        score: -10,
                        feedbackTitle: "Honest but Poor",
                        feedback: "You missed the biggest deal in history."
                    },
                    {
                        text: "Buy 'Q-DOS' from another guy for $50k.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Leverage",
                        feedback: "You bought Q-DOS for $50k, licensed it to IBM for millions, and kept the rights to sell it to others. The smartest deal ever made."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'tension',
                bg: '/assets/avatar_bill_gates.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "IBM PCs ship with MS-DOS. You own the standard for all computing software.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'tension',
                bg: '/assets/avatar_bill_gates.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: LEVERAGE. Bill Gates didn't invent the OS. He acquired it and positioned himself as the gatekeeper. Speed and positioning beat invention.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 21: Steve Jobs (The Rebel)
    'lvl_age_21': {
        title: "The Garage Startup",
        source: "Source: 'Steve Jobs' by Walter Isaacson.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_jobs_garage.png',
                bgPosition: 'object-left',
                text: "It's 1976. You are 21. You and Wozniak built the Apple I circuit board in your parents' garage.",
                choices: [
                    {
                        text: "Sell the schematics to HP.",
                        next: 'employee',
                        score: -10,
                        feedbackTitle: "Employee Mindset",
                        feedback: "Wozniak wanted to do this. If you had, you'd be a mid-level manager at HP today."
                    },
                    {
                        text: "Start a company to sell the boards.",
                        next: 'byte_shop',
                        score: 10,
                        feedbackTitle: "Ownership",
                        feedback: "You realized the value wasn't just in the hobby, but in the product."
                    }
                ]
            },
            {
                id: 'byte_shop',
                bg: '/assets/bg_jobs_store.png',
                text: "The Byte Shop offers to buy 50 computers... giving you barely enough cash for parts.",
                choices: [
                    {
                        text: "Ask dad for a loan.",
                        next: 'slow_growth',
                        score: -5,
                        feedbackTitle: "Safe",
                        feedback: "It works, but you need credit specifically for parts inventory."
                    },
                    {
                        text: "Negotiate 30 days credit with suppliers.",
                        next: 'vision',
                        score: 10,
                        feedbackTitle: "Cash Flow Logic",
                        feedback: "You convinced suppliers to give you parts based on the purchase order. You funded the company on pure salesmanship."
                    }
                ]
            },
            {
                id: 'vision',
                emotion: 'wonder',
                bg: '/assets/scenario_office.jpg',
                text: "You are building the Apple II. Engineers want to add expansion slots for hackers. You want it sealed and beautiful.",
                choices: [
                    {
                        text: "Let the engineers decide.",
                        next: 'generic_pc',
                        score: -10,
                        feedbackTitle: "Design by Committee",
                        feedback: "The Apple II would have been just another ugly gray box."
                    },
                    {
                        text: "Demand perfection. It must handle smoothly.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Product Vision",
                        feedback: "You treated the computer like an appliance, not a toy for geeks. This opened the market to normal people."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'wonder',
                bg: '/assets/avatar_steve_jobs.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Apple goes public. You are worth $200 million at age 25.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'wonder',
                bg: '/assets/avatar_steve_jobs.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: PERFECTIONISM. Jobs didn't settle for 'good enough'. He insisted on end-to-end control and beauty, creating a brand that people loved, not just used.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Walt Disney (The Dreamer)
    'lvl_age_22': {
        title: "The Bankruptcy",
        source: "Source: 'Walt Disney: The Triumph of the American Imagination'.",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_disney_studio_old.png',
                bgPosition: 'object-left',
                text: "It's 1923. You are 22. Your first animation studio 'Laugh-O-Gram' has gone bankrupt. You can't pay rent.",
                choices: [
                    {
                        text: "Get a job at a newspaper.",
                        next: 'normal_life',
                        score: -10,
                        feedbackTitle: "Giving Up",
                        feedback: "Safe choice, but no Mickey Mouse."
                    },
                    {
                        text: "Buy a train ticket to Hollywood.",
                        next: 'hollywood',
                        score: 10,
                        feedbackTitle: "Next Adventure",
                        feedback: "With $40 in his pocket, Walt left his failures in Kansas City and went where the movies were made."
                    }
                ]
            },
            {
                id: 'hollywood',
                bg: '/assets/bg_disney_train.png',
                text: "You lose the rights to your first hit character, 'Oswald the Rabbit'. Your partners betray you.",
                choices: [
                    {
                        text: "Sue them.",
                        next: 'legal_battle',
                        score: -10,
                        feedbackTitle: "Distraction",
                        feedback: "You don't have the money for lawyers. You need a new idea."
                    },
                    {
                        text: "Sketch a new mouse on the train ride home.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Creativity",
                        feedback: "Instead of panicking, Walt sketched Mickey Mouse. The rest is history."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'triumph',
                bg: '/assets/avatar_walt_disney.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Steamboat Willie premieres. It's the first cartoon with sound.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'triumph',
                bg: '/assets/avatar_walt_disney.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: RESILIENCE. Bankruptcy wasn't the end; it was just the prologue. When one door closes (Oswald), draw a door of your own (Mickey).",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 23: Oprah (The Voice)
    'lvl_age_23': {
        title: "The Demotion",
        source: "Source: 'Oprah: A Biography' by Kitty Kelley.",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_oprah_newsroom.png',
                bgPosition: 'object-left',
                text: "It's 1977. You are 23. You land a huge job as a news anchor in Baltimore. But you get too emotional reading the stories.",
                choices: [
                    {
                        text: "Try to be colder and more serious.",
                        next: 'robot',
                        score: -10,
                        feedbackTitle: "Masking",
                        feedback: "You can't suppress your nature. Viewers see through the fake persona."
                    },
                    {
                        text: "Cry when the story is sad. Be you.",
                        next: 'fired',
                        score: 10,
                        feedbackTitle: "Empathy",
                        feedback: "The producer hates it. He fires you from the 6pm news. But your empathy is your superpower."
                    }
                ]
            },
            {
                id: 'fired',
                emotion: 'triumph',
                bg: '/assets/bg_oprah_talkshow.png',
                text: "They demote you to a low-rated morning talk show 'People Are Talking'. It feels like a failure.",
                choices: [
                    {
                        text: "Quit and move home.",
                        next: 'quit',
                        score: -10,
                        feedbackTitle: "Defeat",
                        feedback: "It looked like a demotion, but it was actually an alignment."
                    },
                    {
                        text: "Lean into the talk format.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Finding Flow",
                        feedback: "As soon as you sat in that chair, you realized: 'This is what I was born to do.'"
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'triumph',
                bg: '/assets/avatar_oprah.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The morning show beats Donahue in the ratings. Chicago comes calling.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'triumph',
                bg: '/assets/avatar_oprah.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: ALIGNMENT. Sometimes a 'failure' (getting fired from news) pushes you into your destiny (talk show). Your 'weakness' (emotion) was actually your greatest strength.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 24: Elon Musk (The Iron Man)
    'lvl_age_24': {
        title: "The Couch Surfer",
        source: "Source: 'Elon Musk' by Walter Isaacson.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_musk_office.png',
                bgPosition: 'object-left',
                text: "It's 1995. You are 24. You start Zip2. You have one computer and $2,000.",
                choices: [
                    {
                        text: "Rent an apartment.",
                        next: 'rent_poor',
                        score: -10,
                        feedbackTitle: "Burn Rate",
                        feedback: "You ran out of money. The company died before it started."
                    },
                    {
                        text: "Sleep in the office beanbag.",
                        next: 'grind',
                        score: 10,
                        feedbackTitle: "Sacrifice",
                        feedback: "Elon showered at the YMCA and coded at night. The website was up during the day."
                    }
                ]
            },
            {
                id: 'grind',
                bg: '/assets/bg_musk_coding.png',
                text: "An investor drops by unexpected at 7 AM. You are asleep on the floor.",
                choices: [
                    {
                        text: "Hide in the closet.",
                        next: 'shame',
                        score: -10,
                        feedbackTitle: "Insecurity",
                        feedback: "Don't be ashamed of the hustle."
                    },
                    {
                        text: "Wake up and pitch him.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Dedication",
                        feedback: "He saw how committed you were. He wrote a check for $3 million."
                    }
                ]
            },
            {
                id: 'success',
                bg: '/assets/avatar_elon_musk.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Compaq buys Zip2 for $300 Million. You buy a McLaren.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                bg: '/assets/avatar_elon_musk.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: INTENSITY. Extreme success usually requires a period of extreme imbalance. Elon didn't work 9-5; he worked every waking hour.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 25: J.K. Rowling (The Storyteller)
    'lvl_age_25': {
        title: "The Delayed Train",
        source: "Source: J.K. Rowling's Harvard Commencement Speech.",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_rowling_train_window.png',
                bgPosition: 'object-left',
                text: "It's 1990. You are 25. You are stuck on a delayed train from Manchester to London for 4 hours.",
                choices: [
                    {
                        text: "Read a magazine/Nap.",
                        next: 'nap',
                        score: 0,
                        feedbackTitle: "Boredom",
                        feedback: "You killed time. The idea never came."
                    },
                    {
                        text: "Daydream out the window.",
                        next: 'idea',
                        score: 10,
                        feedbackTitle: "Space for Thought",
                        feedback: "In the silence, a boy wizard with glasses 'just fell into your head'."
                    }
                ]
            },
            {
                id: 'idea',
                emotion: 'determination',
                bg: '/assets/bg_rowling_train_carriage.png',
                text: "You don't have a pen! The idea is flooding your brain.",
                choices: [
                    {
                        text: "Ask a stranger for a pen.",
                        next: 'shy',
                        score: 5,
                        feedbackTitle: "Too Shy",
                        feedback: "Rowling was too shy to ask. She just sat and composed the whole story in her mind perfectly."
                    },
                    {
                        text: "Memorize it all.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Mental Palace",
                        feedback: "By not writing immediately, the details grew richer in her imagination."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_jk_rowling.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You reach King's Cross. You start writing 'Philosopher's Stone'. It will take 7 years to finish.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'determination',
                bg: '/assets/avatar_jk_rowling.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: PATIENCE. The biggest ideas often come in moments of stillness. And great work takes time—years of it.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },


    // --- ARNOLD SCHWARZENEGGER (Age 20 - The Gamble) ---
    'scenario_arnold_awol': {
        title: "The AWOL Gamble",
        source: "Source: Arnold's Autobiography.",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_arnold_train.jpg',
                text: "You are 20. Private in the Austrian Army. The 'Mr. Universe' competition is tomorrow in Germany. You are forbidden to leave.",
                choices: [
                    {
                        text: "Stay at Base",
                        next: 'stay_regret',
                        score: 3,
                        feedbackTitle: "Good Soldier",
                        feedback: "You followed orders. You watched the winner on TV. You realized you valued obedience over your dream."
                    },
                    {
                        text: "Go AWOL",
                        next: 'escape_win',
                        score: 10,
                        feedbackTitle: "The Risk",
                        feedback: "You crawled under the fence, jumped a freight train, and won the trophy! You spent a week in military prison when you returned. Worth it."
                    },
                    {
                        text: "Ask for permission",
                        next: 'ask_fail',
                        score: 5,
                        feedbackTitle: "Bureaucracy",
                        feedback: "You filed the paperwork. The request was denied 3 weeks later. The competition was already over."
                    }
                ]
            },
            {
                id: 'stay_regret',
                bg: '/assets/bg_arnold_train.jpg',
                text: "The regret weighs heavier than the tank you drive.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'ask_fail',
                bg: '/assets/bg_arnold_train.jpg',
                text: "You followed the rules, but the rules weren't made for champions.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'escape_win',
                emotion: 'determination',
                bg: '/assets/avatar_arnold.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "'Punish me,' you told the officers. 'But look at this trophy.' They put it on the mess hall wall.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_ARNOLD', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_ARNOLD',
                emotion: 'determination',
                bg: '/assets/avatar_arnold.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: VISION. Rules are there to be broken if the vision is strong enough. 'I didn't want to be a soldier, I wanted to be a Star.'",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // --- STEPHEN HAWKING (Age 20 - The Defiance) ---
    'scenario_hawking_diagnosis': {
        title: "The Death Sentence",
        source: "Source: My Brief History.",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_hawking_study.jpg',
                text: "You are 20. The doctors say you have ALS. Two years to live. Your body is failing.",
                choices: [
                    {
                        text: "Listen to Wagner",
                        next: 'give_up',
                        score: 2,
                        feedbackTitle: "Darkness",
                        feedback: "You drank and listened to sad opera. Why work on a PhD if you're going to die?"
                    },
                    {
                        text: "Focus on Work",
                        next: 'purpose_win',
                        score: 10,
                        feedbackTitle: "Mind Over Matter",
                        feedback: "You realized: 'Who knows if I have 2 years or 50? I have time NOW.' You poured your remaining energy into physics."
                    },
                    {
                        text: "Travel the world",
                        next: 'travel_fail',
                        score: 4,
                        feedbackTitle: "Running Away",
                        feedback: "You tried to see the world, but your body couldn't handle the travel. You returned exhausted and felt you wasted precious time."
                    }
                ]
            },
            {
                id: 'give_up',
                bg: '/assets/bg_hawking_study.jpg',
                text: "The universe remains unsolved.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'travel_fail',
                bg: '/assets/bg_hawking_study.jpg',
                text: "Searching for external beauty didn't solve the internal chaos.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'purpose_win',
                emotion: 'wonder',
                bg: '/assets/avatar_hawking.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You didn't die in 2 years. You lived for 55 more, decoding black holes.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_HAWKING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_HAWKING',
                emotion: 'wonder',
                bg: '/assets/avatar_hawking.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: TIME. 'However difficult life may seem, there is always something you can do and succeed at.'",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // --- TINA DABI (Age 24 - The Strategist) ---
    'scenario_upsc_tina_college': {
        title: "The College Sacrifice",
        source: "Source: Tina Dabi's Interviews (2015 Topper).",
        frames: [
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg_college_canteen.jpg',
                text: "It's your final year at LSR. Everyone is going on a 'Farewell Trip' to Goa. It's the last time to bond with friends.",
                choices: [
                    {
                        text: "Go to Goa",
                        next: 'trip',
                        score: 5,
                        feedbackTitle: "Memories vs Mission",
                        feedback: "You had a great time, but you missed a critical week of Current Affairs. The guilt distracted you for a month."
                    },
                    {
                        text: "Stay in Hostel",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Lonely Path",
                        feedback: "It was miserable watching their photos. But you finished 3 months of backlog newspapers. That discipline won you Rank 1."
                    },
                    {
                        text: "Go for 2 days then study",
                        next: 'balance_fail',
                        score: 6,
                        feedbackTitle: "Half-Hearted",
                        feedback: "You tried to balance both. You came back tired and still missed critical study time. You cleared the exam but missed the top rank."
                    }
                ]
            },
            {
                id: 'trip',
                bg: '/assets/bg_college_canteen.jpg',
                text: "You come back refreshed, but your mock test scores drop. Regulation is key.",
                choices: [
                    { text: "Try Again", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'balance_fail',
                emotion: 'determination',
                bg: '/assets/bg_college_canteen.jpg',
                text: "'Balance' is for average people. Toppers are obsessed.",
                choices: [
                    { text: "Restart", next: 'intro', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_tina_dabi.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your friends have memories. You have a vision. The foundation is set.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING_TINA_1', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING_TINA_1',
                emotion: 'determination',
                bg: '/assets/avatar_tina_dabi.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: SACRIFICE. Success requires saying 'No' to good things (fun/friends) to say 'Yes' to great things (The Goal).",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },




    // AGE 20 (Literature): Mary Shelley (The Creator)
    'lvl_age_20_literature': {
        title: "The Monster's Birth",
        source: "Source: 'Mary Shelley: Her Life, Her Fiction, Her Monsters'.",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_shelley_villa.jpg',
                bgPosition: 'object-left',
                text: "It's 1816. You are 19 (nearly 20). You are at Villa Diodati with Lord Byron. A storm traps you inside. Byron suggests a ghost story contest.",
                choices: [
                    {
                        text: "Write a typical ghost story about a haunted castle.",
                        next: 'safe_story',
                        score: -10,
                        feedbackTitle: "Cliché",
                        feedback: "It was forgotten. You followed the trend instead of your nightmares."
                    },
                    {
                        text: "Write about a man playing God with science.",
                        next: 'monster_idea',
                        score: 10,
                        feedbackTitle: "Originality",
                        feedback: "You tapped into the fears of the industrial age. Frankenstein was born."
                    }
                ]
            },
            {
                id: 'safe_story',
                bg: '/assets/bg_shelley_writing.jpg',
                text: "Byron yawns. Your story is polite, but it doesn't scare anyone.",
                choices: [
                    { text: "Try Deeper", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'monster_idea',
                emotion: 'fear',
                bg: '/assets/bg_shelley_writing.jpg',
                text: "You have the idea, but it's terrifying. A reanimated corpse. People might call it blasphemy.",
                choices: [
                    {
                        text: "Soften it. Make it a moral lesson.",
                        next: 'diluted',
                        score: -5,
                        feedbackTitle: "Compromise",
                        feedback: "You lost the raw horror. The story loses its power."
                    },
                    {
                        text: "Write it raw. The horror is the point.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Bold Truth",
                        feedback: "You wrote the first Science Fiction novel in history. You changed literature forever."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'fear',
                bg: '/assets/avatar_mary_shelley.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Frankenstein becomes a sensation. You are the mother of Science Fiction.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'fear',
                bg: '/assets/avatar_mary_shelley.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: IMAGINATION. Mary Shelley took a simple prompt and looked into the darkest corners of science and humanity. Don't be afraid of your own dark ideas.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20 (Cinema): Steven Spielberg (The Director)
    'lvl_age_20_cinema': {
        title: "The Universal Gate",
        source: "Source: 'Steven Spielberg: A Biography'.",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_spielberg_universal.jpg',
                bgPosition: 'object-left',
                text: "It's 1966. You are 20. You've been rejected from USC film school 3 times. You are on a tour bus at Universal Studios.",
                choices: [
                    {
                        text: "Enjoy the tour. Apply again next year.",
                        next: 'wait',
                        score: -10,
                        feedbackTitle: "Waiting",
                        feedback: "You waited for permission. Hollywood doesn't give permission."
                    },
                    {
                        text: "Jump off the bus and hide in a bathroom.",
                        next: 'sneak',
                        score: 10,
                        feedbackTitle: "The Jump",
                        feedback: "You snuck onto the lot. You decided you belonged there, even if they didn't invite you."
                    }
                ]
            },
            {
                id: 'wait',
                bg: '/assets/bg_spielberg_universal.jpg',
                text: "You go home. Another year passes. You are still not a director.",
                choices: [
                    { text: "Try Again", next: 'intro', score: -5, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'sneak',
                emotion: 'wonder',
                bg: '/assets/bg_spielberg_office.jpg',
                text: "You find an empty office in the editorial department. It's unlocked.",
                choices: [
                    {
                        text: "Hide in there until nightfall.",
                        next: 'hiding',
                        score: -5,
                        feedbackTitle: "Fear",
                        feedback: "You're just a trespasser. You need to be a director."
                    },
                    {
                        text: "Put your name on the door: 'Steven Spielberg, Director'.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Fake It 'Til You Make It",
                        feedback: "You wore a suit, carried a briefcase, and pretended you worked there. Security waved you in every day for months."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'wonder',
                bg: '/assets/avatar_spielberg_young.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Sid Sheinberg sees your short film 'Amblin' and offers you a 7-year contract. You are a director.",
                choices: [
                    { text: "Next Chapter", next: 'LEARNING', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'LEARNING',
                emotion: 'wonder',
                bg: '/assets/avatar_spielberg_young.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LESSON: AUDACITY. Spielberg didn't wait for a degree. He claimed his spot. Sometimes you have to authorize yourself.",
                choices: [
                    { text: "Collect Reward", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: P.V. Sindhu
    'lvl_age_17_sindhu': {
        title: "The Olympic Prelude",
        source: "Source: Various Interviews, 2012 Journey",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_sindhu.jpg',
                audio_hi: '/assets/voice_sindhu_intro_hi_v2.mp3',
                text: "It is 2012. You are 17. You are facing Li Xuerui, the reigning Olympic gold medalist. She is older, stronger, and seemingly invincible. Your body is exhausted from the tournament. The pressure is immense.",
                choices: [
                    {
                        text: "Focus entirely on defense. Try to outlast her rallies and wait for her to make unforced errors.",
                        next: 'defend',
                        score: -5,
                        feedbackTitle: "Playing Safe is Playing to Lose",
                        feedback: "Li Xuerui is too experienced. She realizes you are playing not to lose, rather than playing to win, and she systematically dismantles your defense."
                    },
                    {
                        text: "Play aggressively. Attack her serves and dictate the pace, even if it burns your remaining stamina.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "The Challenger's Mindset",
                        feedback: "You surprise her with your sheer aggression. You take control of the net, forcing her to play your game."
                    }
                ]
            },
            {
                id: 'defend',
                bg: '/assets/bg_sindhu.jpg',
                text: "You lost the game, but learned a crucial lesson: against greatness, you cannot survive by waiting. You must strike.",
                choices: [
                    {
                        text: "Re-focus. Accept the risk of exhaustion and switch to an aggressive attack strategy.",
                        next: 'attack',
                        score: 10,
                        feedbackTitle: "Adaptation",
                        feedback: "You reset your mindset."
                    }
                ]
            },
            {
                id: 'attack',
                emotion: 'determination',
                bg: '/assets/bg_sindhu.jpg',
                text: "You win the first set. But your stamina is dropping dangerously low. The coach warns you to slow down, but Li is turning up the pressure.",
                choices: [
                    {
                        text: "Trust your physical conditioning. Push through the pain and maintain the aggressive tempo.",
                        next: 'push',
                        score: 10,
                        feedbackTitle: "Breaking Limits",
                        feedback: "You push your body beyond what you thought was possible. The sheer willpower breaks your opponent's rhythm."
                    },
                    {
                        text: "Listen to the coach. Slow down the game to recover stamina for the final set.",
                        next: 'slow',
                        score: -5,
                        feedbackTitle: "Lost Momentum",
                        feedback: "Slowing down gives Li exactly what she needs. She recovers, takes the second set, and crushes you in the third."
                    }
                ]
            },
            {
                id: 'slow',
                emotion: 'determination',
                bg: '/assets/bg_sindhu.jpg',
                text: "You lost the momentum and the match. You realize that sometimes, momentum is more important than energy.",
                choices: [
                    {
                        text: "Learn from it. Trust your instincts on the court.",
                        next: 'push',
                        score: 10,
                        feedbackTitle: "A Hard Lesson",
                        feedback: "You vow never to give up dominance when you have it."
                    }
                ]
            },
            {
                id: 'push',
                emotion: 'determination',
                bg: '/assets/avatar_sindhu.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You defeat the Olympic Champion. At 17, you announce your arrival on the world stage, proving that no giant is invincible.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Giant Killer", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: A.R. Rahman
    'lvl_age_17_rahman': {
        title: "The Silent Melody",
        source: "Source: Biography of A.R. Rahman",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_rahman.jpg',
                text: "It is 1984. You are 17. Your father has passed away, leaving your family in deep financial trouble. You are gifted at the keyboard, but your mother urges you to drop out of school to become a full-time session musician for film composers.",
                choices: [
                    {
                        text: "Refuse. Education is the only safe path out of poverty. Try to find a part-time job outside of music.",
                        next: 'school',
                        score: -5,
                        feedbackTitle: "The Safe Illusion",
                        feedback: "You struggle to balance part-time work and school. Your family slips further into debt, and you lose touch with your greatest gift."
                    },
                    {
                        text: "Accept the burden. Drop out of school and immerse yourself completely in music to support your family.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Embracing Destiny",
                        feedback: "You sacrifice your childhood, playing 12 hours a day across multiple studios. The grueling schedule forces you to master every genre."
                    }
                ]
            },
            {
                id: 'school',
                bg: '/assets/bg_rahman.jpg',
                text: "Safety isn't saving your family. You realize your music is the only true leverage you have.",
                choices: [
                    {
                        text: "Leave school. Commit to the studios.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "The Necessary Sacrifice",
                        feedback: "You make the hardest choice of your life."
                    }
                ]
            },
            {
                id: 'drop',
                emotion: 'determination',
                bg: '/assets/bg_rahman.jpg',
                text: "You are working endlessly for other composers. They take the credit, and you just get a daily wage. You are exhausted and feeling creatively stifled.",
                choices: [
                    {
                        text: "Start composing your own jingles at night, sacrificing what little sleep you have to build your own identity.",
                        next: 'jingles',
                        score: 10,
                        feedbackTitle: "The Midnight Hustle",
                        feedback: "You work 18-hour days. But your private jingles catch the attention of ad agencies, carving out a space that is truly yours."
                    },
                    {
                        text: "Accept your lot. Being a top session player is good money and keeps the family fed.",
                        next: 'complacent',
                        score: -5,
                        feedbackTitle: "The Golden Cage",
                        feedback: "You become the most sought-after keyboardist in Chennai, but completely lose your unique voice. You remain a background player forever."
                    }
                ]
            },
            {
                id: 'complacent',
                emotion: 'determination',
                bg: '/assets/bg_rahman.jpg',
                text: "You feel hollow. Playing other people's music isn't why you were given this gift.",
                choices: [
                    {
                        text: "Wake up. Start writing your own music at night.",
                        next: 'jingles',
                        score: 10,
                        feedbackTitle: "Finding Your Voice",
                        feedback: "You reclaim your creative soul."
                    }
                ]
            },
            {
                id: 'jingles',
                emotion: 'determination',
                bg: '/assets/avatar_rahman.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Your ad jingles become legendary. Soon, a director named Mani Ratnam will hear your work, and the rest is history.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Mozart of Madras", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Malala Yousafzai
    'lvl_age_17_malala': {
        title: "The Price of Peace",
        source: "Source: 'I Am Malala'",
        frames: [
            {
                id: 'intro',
                emotion: 'hope',
                bg: '/assets/bg_malala.jpg',
                text: "It is 2014. You are 17. You survived a horrific assassination attempt by the Taliban. Now, you have just been awarded the Nobel Peace Prize. The world wants you to be their spokesperson, but you just want to pass your high school exams.",
                choices: [
                    {
                        text: "Embrace the global platform immediately. Drop out of regular school to tour the world and advocate for girls' rights full-time.",
                        next: 'tour',
                        score: -5,
                        feedbackTitle: "Losing the Anchor",
                        feedback: "You become a powerful figurehead, but you feel disconnected from the very identity of being a 'student' that you fought so hard for."
                    },
                    {
                        text: "Protect your normalcy. Balance your global advocacy with strict, unwavering dedication to finishing your high school education.",
                        next: 'balance',
                        score: 10,
                        feedbackTitle: "Walking the Talk",
                        feedback: "You prove that education isn't just a talking point—it's your actual priority. You ground yourself, maintaining your authenticity."
                    }
                ]
            },
            {
                id: 'tour',
                bg: '/assets/bg_malala.jpg',
                text: "The speeches are inspiring, but you feel like a politician, not a girl fighting for education. You need your books.",
                choices: [
                    {
                        text: "Cancel the tour. Go back to class.",
                        next: 'balance',
                        score: 10,
                        feedbackTitle: "Returning to Roots",
                        feedback: "You remember what you were fighting for in the first place."
                    }
                ]
            },
            {
                id: 'balance',
                emotion: 'anger',
                bg: '/assets/bg_malala.jpg',
                text: "Balancing schoolwork and meeting world leaders is exhausting. Politicians try to use your image for their own agendas.",
                choices: [
                    {
                        text: "Speak your unvarnished truth, even if it makes powerful politicians and donors uncomfortable.",
                        next: 'truth',
                        score: 10,
                        feedbackTitle: "Uncompromising Peace",
                        feedback: "You confront world leaders on their hypocrisy regarding war and education. Your bravery cements your legacy."
                    },
                    {
                        text: "Stick to safe, polished PR scripts to ensure you don't alienate major international donors.",
                        next: 'safe',
                        score: -5,
                        feedbackTitle: "The PR Trap",
                        feedback: "You become a safe, sanitized symbol. The impact of your voice diminishes as you blend into political bureaucracy."
                    }
                ]
            },
            {
                id: 'safe',
                emotion: 'anger',
                bg: '/assets/bg_malala.jpg',
                text: "You realize you didn't survive a bullet just to read safe PR scripts.",
                choices: [
                    {
                        text: "Tear up the script. Speak from the heart.",
                        next: 'truth',
                        score: 10,
                        feedbackTitle: "Finding the Courage Again",
                        feedback: "You reclaim your voice."
                    }
                ]
            },
            {
                id: 'truth',
                emotion: 'anger',
                bg: '/assets/avatar_malala.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You pass your exams, head to Oxford, and change the world on your own terms. You proved the pen is mightier than the sword.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Unbreakable Pen", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Steve Jobs
    'lvl_age_17_jobs': {
        title: "The Dropout's Intuition",
        source: "Source: Steve Jobs' Stanford Commencement Address",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_jobs.jpg',
                text: "It is 1972. You are 17. You are enrolled at Reed College, an expensive private school. Your working-class parents are draining their life savings to pay for it, but you have no idea what you want to do with your life, and the required classes bore you.",
                choices: [
                    {
                        text: "Stay in school out of guilt. Force yourself to get a generic degree so your parents' money isn't wasted.",
                        next: 'stay',
                        score: -5,
                        feedbackTitle: "The Path of Regret",
                        feedback: "You graduate, but you are miserable. You take a safe corporate job and never discover the intersection of art and technology."
                    },
                    {
                        text: "Drop out. Stop spending their money, sleep on friends' floors, and only audit the classes that genuinely interest you.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Trusting Intuition",
                        feedback: "It is terrifying, but incredibly freeing. You stop taking required courses and start following your curiosity."
                    }
                ]
            },
            {
                id: 'stay',
                bg: '/assets/bg_jobs.jpg',
                text: "The guilt is eating you alive, but the boredom is worse. You realize you are wasting both time AND money.",
                choices: [
                    {
                        text: "Find the courage to drop out.",
                        next: 'drop',
                        score: 10,
                        feedbackTitle: "Taking the Leap",
                        feedback: "You cut the safety net."
                    }
                ]
            },
            {
                id: 'drop',
                emotion: 'wonder',
                bg: '/assets/bg_jobs.jpg',
                text: "You are auditing classes for free. One of them is Calligraphy. It has zero practical application in your life, but you find it beautiful.",
                choices: [
                    {
                        text: "Immerse yourself in typography. Learn about serif and sans-serif typefaces, purely for the artistry of it.",
                        next: 'fonts',
                        score: 10,
                        feedbackTitle: "Connecting the Dots",
                        feedback: "You learn what makes great typography great. It seems useless now, but it is laying the foundation for the future."
                    },
                    {
                        text: "Quit the calligraphy class. You need to focus on finding a practical job to feed yourself.",
                        next: 'practical',
                        score: -5,
                        feedbackTitle: "Trading Vision for Survival",
                        feedback: "You get a job repairing TVs. It pays the bills, but you lose the artistic edge that makes you special."
                    }
                ]
            },
            {
                id: 'practical',
                emotion: 'wonder',
                bg: '/assets/bg_jobs.jpg',
                text: "Repairing TVs is fine, but you feel empty without the art.",
                choices: [
                    {
                        text: "Go back to the calligraphy classes.",
                        next: 'fonts',
                        score: 10,
                        feedbackTitle: "Embracing Art",
                        feedback: "You return to your true passion."
                    }
                ]
            },
            {
                id: 'fonts',
                emotion: 'wonder',
                bg: '/assets/avatar_jobs.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ten years later, you will design the first Macintosh computer. Because of that calligraphy class, it will be the first computer with beautiful typography. You couldn't connect the dots looking forward, only looking backward.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Intersection", feedback: "" }
                ]
            }
        ]
    },
    // AGE 17: Indra Nooyi
    'lvl_age_17_nooyi': {
        title: "The Rulebreaker",
        source: "Source: 'My Life in Full' by Indra Nooyi",
        frames: [
            {
                id: 'intro',
                emotion: 'anger',
                bg: '/assets/bg_nooyi.jpg',
                text: "It is 1972. You are 17, studying at Madras Christian College in conservative Chennai. Society expects you to be quiet, demure, and prepare for an arranged marriage. Instead, you want to join an all-girls rock band and play guitar.",
                choices: [
                    {
                        text: "Join the rock band. Play guitar, sing loud, and defy every expectation of what a 'good Indian girl' should do.",
                        next: 'rebel',
                        score: 10,
                        feedbackTitle: "The Disruptor",
                        feedback: "You face massive criticism from neighborhood aunties, but you discover a fierce confidence and leadership style that will define your life."
                    },
                    {
                        text: "Conform. Focus quietly on your studies so you don't bring 'shame' or unwanted attention to your family.",
                        next: 'conform',
                        score: -5,
                        feedbackTitle: "The Invisible Girl",
                        feedback: "You get good grades, but you internalize the idea that you should make yourself smaller to please others. Your leadership potential Withers."
                    }
                ]
            },
            {
                id: 'conform',
                bg: '/assets/bg_nooyi.jpg',
                text: "Holding back your personality makes you miserable. You realize that true leadership requires standing out.",
                choices: [
                    {
                        text: "Pick up the guitar. Join the band.",
                        next: 'rebel',
                        score: 10,
                        feedbackTitle: "Taking the Stage",
                        feedback: "You decide to be seen on your own terms."
                    }
                ]
            },
            {
                id: 'rebel',
                emotion: 'determination',
                bg: '/assets/bg_nooyi.jpg',
                text: "You are rocking out on stage, but now the college has formed a women's cricket team. It's rough, physical, and even more controversial than the band.",
                choices: [
                    {
                        text: "Focus entirely on the band. You've broken enough rules for one year.",
                        next: 'safe',
                        score: -5,
                        feedbackTitle: "Half Measures",
                        feedback: "You enjoy the band, but miss out on the incredible team-building and strategic dynamics of competitive sports."
                    },
                    {
                        text: "Join the cricket team too. Embrace every unconventional opportunity to lead and compete.",
                        next: 'compete',
                        score: 10,
                        feedbackTitle: "The Ultimate Competitor",
                        feedback: "You excel on the pitch. You learn how to lead a diverse team under pressure, a skill that will one day help you run a Fortune 50 company."
                    }
                ]
            },
            {
                id: 'safe',
                emotion: 'determination',
                bg: '/assets/bg_nooyi.jpg',
                text: "You realize you shouldn't limit yourself just because society thinks you've 'done enough'.",
                choices: [
                    {
                        text: "Grab a bat. Join the team.",
                        next: 'compete',
                        score: 10,
                        feedbackTitle: "Diving In",
                        feedback: "You embrace the competition."
                    }
                ]
            },
            {
                id: 'compete',
                emotion: 'determination',
                bg: '/assets/avatar_nooyi.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You broke every mold in Madras. Decades later, that same defiant confidence will make you the CEO of PepsiCo.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Ceiling Smasher", feedback: "" }
                ]
            }
        ]
    },

    // AGE 17: Shah Rukh Khan — "The Stage or The Books"
    'lvl_age_17_srk': {
        title: "The Stage or The Books",
        source: "Source: Theatre Action Group (TAG) Delhi, 1982",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_srk_age17.jpg',
                portrait: '/assets/portrait-srk-17.png.jpg',
                text: "It's 1982. You are 17. Your father just passed away. Your family has very little money. Your theatre teacher says you have a rare gift. Your mother needs you to focus on studies. Your friends are all preparing for engineering exams.",
                choices: [
                    {
                        text: "Focus entirely on studies — get a stable career first, theatre can wait.",
                        next: 'choice_a',
                        score: -5,
                        feedbackTitle: "Security Over Passion",
                        feedback: "You chose security. SRK understood that feeling — he had real financial pressure. But he knew security without passion is just survival. What dream are you delaying for safety?"
                    },
                    {
                        text: "Do both — studies by day, theatre rehearsals by night, sleep less.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "DUAL COMMITMENT",
                        feedback: "You think like SRK. You refused to choose. This path is exhausting but it keeps both fires alive. The question is — can you sustain it?"
                    },
                    {
                        text: "Tell your mother honestly that theatre is your calling and ask for her support.",
                        next: 'choice_c',
                        score: 5,
                        feedbackTitle: "Brave Honesty",
                        feedback: "You chose honesty. SRK eventually had that conversation too. Telling the people you love what you truly want takes more courage than talent."
                    }
                ]
            },
            {
                id: 'choice_a',
                emotion: 'determination',
                bg: '/assets/bg_srk_age17.jpg',
                portrait: '/assets/portrait-srk-17.png.jpg',
                text: "You study hard, but the stage calls to you every night. A year passes and you feel hollow despite your grades. SRK chose differently — he studied hard AND trained under Barry John at Theatre Action Group, performing late into the nights.",
                choices: [
                    {
                        text: "Find the courage to do both — studies by day, theatre by night.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Reclaiming Both Dreams",
                        feedback: "The world will always ask you to choose. SRK refused. He held two dreams at once and slept less so both could survive."
                    }
                ]
            },
            {
                id: 'choice_c',
                emotion: 'determination',
                bg: '/assets/bg_srk_age17.jpg',
                portrait: '/assets/portrait-srk-17.png.jpg',
                text: "Your mother listens. She can't promise support but she doesn't forbid it either. SRK went further — he committed to both fully, neither asking permission nor abandoning responsibility.",
                choices: [
                    {
                        text: "Commit to both — prove your dedication through action, not words.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Action Over Words",
                        feedback: "True commitment shows in what you do, not what you say. SRK didn't wait for permission — he acted."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/bg_srk_age17.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "DUAL COMMITMENT. The world will always ask you to choose. SRK refused. He held two dreams at once and slept less so both could survive. Sometimes the answer isn't either/or — it's both, and harder.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Stage and The Books", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19 (story 2): Shah Rukh Khan — "Leave Delhi or Stay"
    'lvl_age_19_srk_2': {
        title: "Leave Delhi or Stay",
        source: "Source: Shah Rukh Khan's Delhi years, 1984",
        frames: [
            {
                id: 'intro',
                emotion: 'love',
                bg: '/assets/bg_srk_age19b.jpg',
                portrait: '/assets/portrait-srk-19.png.jpg',
                text: "It's 1984. You are 19. You've been performing with Theatre Action Group for 2 years. Doordarshan has noticed you. Mumbai is calling. But your mother is unwell. Your sister depends on you. You have no contacts in Mumbai, no money saved, no place to stay.",
                choices: [
                    {
                        text: "Stay in Delhi — family comes first, Mumbai can wait.",
                        next: 'choice_a',
                        score: 10,
                        feedbackTitle: "Family Before Fame",
                        feedback: "You and SRK made the same call. Family before fame. Some people see this as sacrifice — SRK saw it as foundation. Everything he built in Mumbai, he built on a clear conscience."
                    },
                    {
                        text: "Go to Mumbai immediately — opportunities don't wait for perfect timing.",
                        next: 'choice_b',
                        score: -5,
                        feedbackTitle: "Fire Without Roots",
                        feedback: "You have fire. SRK had it too. But he learned that burning bridges behind you means you have nowhere to rest when Mumbai gets hard. Did you think about what you'd be leaving behind?"
                    },
                    {
                        text: "Take the Doordarshan role in Delhi first, save money, then go to Mumbai in 2 years with a plan.",
                        next: 'lesson',
                        score: 8,
                        feedbackTitle: "TIMING IS STRATEGY",
                        feedback: "Strategic. SRK eventually did something similar — he built his base, saved his energy, and moved when the time was right. Planning isn't fear — it's respect for the journey."
                    }
                ]
            },
            {
                id: 'choice_a',
                emotion: 'determination',
                bg: '/assets/bg_srk_age19b.jpg',
                portrait: '/assets/portrait-srk-19.png.jpg',
                text: "You stay. You take every Delhi opportunity — Doordarshan, theatre, TV serials. Years later, when you finally move, you carry no guilt — only foundation. This is exactly what SRK did.",
                choices: [
                    {
                        text: "Continue building your base in Delhi until the time is truly right.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Roots Before Wings",
                        feedback: "Ambition without roots collapses. SRK stayed not because he was afraid — but because he understood that leaving at the wrong time creates guilt that haunts your best work."
                    }
                ]
            },
            {
                id: 'choice_b',
                emotion: 'determination',
                bg: '/assets/bg_srk_age19b.jpg',
                portrait: '/assets/portrait-srk-19.png.jpg',
                text: "Mumbai is harder than you imagined. No contacts, no money, and the guilt of leaving your family weighs heavy. SRK waited until he was truly ready — he only moved to Mumbai after his mother passed away in 1991 at age 25.",
                choices: [
                    {
                        text: "Go back to Delhi and build your foundation properly before the next attempt.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Wisdom Over Impatience",
                        feedback: "Going back isn't failure — it's strategy. SRK went when he was truly ready, and that made all the difference."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/bg_srk_age19b.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "TIMING IS STRATEGY. Ambition without roots collapses. SRK stayed not because he was afraid — but because he understood that leaving at the wrong time creates guilt that haunts your best work. He went when he was truly ready.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Right Time", feedback: "" }
                ]
            }
        ]
    },

    // AGE 21: Shah Rukh Khan — "The Role That Could Destroy You"
    'lvl_age_21_srk': {
        title: "The Role That Could Destroy You",
        source: "Source: Shah Rukh Khan's Delhi theatre years, 1986",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_srk_age21.jpg',
                portrait: '/assets/portrait-srk-21.png.jpg',
                text: "It's 1986. You are 21. A director offers you a villain role — dark, menacing, psychologically complex. Everyone advises against it. 'First impressions matter. If audiences see you as evil, they'll never love you as a hero.' Another director is offering you a safe romantic lead.",
                choices: [
                    {
                        text: "Take the romantic lead — build a lovable image first.",
                        next: 'choice_a',
                        score: -5,
                        feedbackTitle: "Image Over Instinct",
                        feedback: "You chose image over instinct. Safe choices compound into a safe life. SRK proved that the roles that scare you are often the ones that define you."
                    },
                    {
                        text: "Take the villain role — great writing always wins.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "COMPLEXITY OVER COMFORT",
                        feedback: "You think like SRK. You trusted the writing over the fear. Great material is rare — when you find it, you hold on."
                    },
                    {
                        text: "Ask both directors for 2 weeks to decide and research both characters deeply.",
                        next: 'choice_c',
                        score: 5,
                        feedbackTitle: "The Analyst",
                        feedback: "You're thorough. SRK was impulsive but deeply instinctive. Sometimes thinking too long kills the feeling that made the opportunity exciting in the first place."
                    }
                ]
            },
            {
                id: 'choice_a',
                emotion: 'determination',
                bg: '/assets/bg_srk_age21.jpg',
                portrait: '/assets/portrait-srk-21.png.jpg',
                text: "The romantic lead role is forgettable. You are likeable but unmemorable. SRK's villain roles in Darr and Baazigar made him a superstar — not his hero roles. Complex characters reveal true talent.",
                choices: [
                    {
                        text: "Go back and take the villain role — trust the writing, not the image.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Trusting the Craft",
                        feedback: "Playing safe builds a career. Playing true builds a legend. SRK understood that audiences don't just want to love you — they want to be surprised by you."
                    }
                ]
            },
            {
                id: 'choice_c',
                emotion: 'determination',
                bg: '/assets/bg_srk_age21.jpg',
                portrait: '/assets/portrait-srk-21.png.jpg',
                text: "Two weeks later, the villain director has moved on — he found someone willing to commit. The window closed while you were thinking. SRK always said: when the right material finds you, you know it in your gut.",
                choices: [
                    {
                        text: "Learn from this — next time, trust your gut faster.",
                        next: 'lesson',
                        score: 8,
                        feedbackTitle: "The Cost of Hesitation",
                        feedback: "Analysis has its place. But the best opportunities carry a feeling — and that feeling doesn't wait for spreadsheets."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/bg_srk_age21.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "COMPLEXITY OVER COMFORT. Playing safe builds a career. Playing true builds a legend. SRK understood that audiences don't just want to love you — they want to be surprised by you.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Brave Choice", feedback: "" }
                ]
            }
        ]
    },

    // AGE 23: Shah Rukh Khan — "Gauri or Career"
    'lvl_age_23_srk': {
        title: "Gauri or Career",
        source: "Source: Shah Rukh Khan's personal life, Delhi 1988",
        frames: [
            {
                id: 'intro',
                emotion: 'love',
                bg: '/assets/bg_srk_age23.jpg',
                portrait: '/assets/portrait-srk-23.png.jpg',
                text: "It's 1988. You are 23. You've been with Gauri for 3 years. Both families have objections. Mumbai producers are interested — this is the moment you've waited for. Gauri says she'll wait but she's scared. Some people say focus on career first, relationships later.",
                choices: [
                    {
                        text: "Go to Mumbai alone — focus on career, let the relationship find its natural path.",
                        next: 'choice_a',
                        score: -5,
                        feedbackTitle: "Ambition Alone",
                        feedback: "You chose ambition. SRK understood that pull. But he also knew that achieving everything alone feels hollow. Who will you share it with when you get there?"
                    },
                    {
                        text: "Ask Gauri to come with you to Mumbai — figure it out together.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "LOVE IS NOT A DISTRACTION",
                        feedback: "You chose together. SRK and Gauri figured it out in real time — messy, uncertain, but real. The best partnerships are built in chaos, not comfort."
                    },
                    {
                        text: "Stay in Delhi one more year — stabilize the relationship first, then go together.",
                        next: 'choice_c',
                        score: 5,
                        feedbackTitle: "Patient Planning",
                        feedback: "You chose patience. Sometimes that's wisdom. But SRK learned that waiting for perfect conditions means waiting forever. Life doesn't pause for you to feel ready."
                    }
                ]
            },
            {
                id: 'choice_a',
                emotion: 'determination',
                bg: '/assets/bg_srk_age23.jpg',
                portrait: '/assets/portrait-srk-23.png.jpg',
                text: "You reach Mumbai. Career is moving. But the loneliness is louder than the applause. You miss Gauri. SRK went to Mumbai AND fought for Gauri — they married in 1991 against family resistance. He refused to choose between love and ambition.",
                choices: [
                    {
                        text: "Fight for her. Ask Gauri to join you in Mumbai.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "Love as Foundation",
                        feedback: "The right relationship doesn't slow you down — it becomes your foundation. SRK proved it."
                    }
                ]
            },
            {
                id: 'choice_c',
                emotion: 'determination',
                bg: '/assets/bg_srk_age23.jpg',
                portrait: '/assets/portrait-srk-23.png.jpg',
                text: "A year passes. The producer who was interested has moved on. The window was real and it closed. SRK learned that the best move is often the bold one — take the opportunity and take the person you love, together.",
                choices: [
                    {
                        text: "Commit fully — take the leap to Mumbai with Gauri now.",
                        next: 'lesson',
                        score: 8,
                        feedbackTitle: "Together Is Stronger",
                        feedback: "The world tells young people to choose between love and success. SRK proved the right relationship makes you MORE yourself, not less."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/bg_srk_age23.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "LOVE IS NOT A DISTRACTION. The world tells young people to choose between love and success. SRK proved that the right relationship doesn't slow you down — it becomes your foundation. Choose people who make you MORE yourself, not less.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Love and Ambition", feedback: "" }
                ]
            }
        ]
    },

    // AGE 25: Shah Rukh Khan — "Mumbai Is Eating Me Alive"
    'lvl_age_25_srk': {
        title: "Mumbai Is Eating Me Alive",
        source: "Source: Shah Rukh Khan's early Mumbai years, 1990",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_srk_age25.jpg',
                portrait: '/assets/portrait-srk-25.png.jpg',
                text: "It's 1990. You are 25. You moved to Mumbai. Bollywood is not opening its doors. You've been rejected from multiple films. Money is running out. A producer offers you a supporting role in a big film — good pay but not the lead. Another option: a small independent film where you're the lead but no guarantee of release.",
                choices: [
                    {
                        text: "Take the supporting role — money in hand, big film exposure.",
                        next: 'choice_a',
                        score: -5,
                        feedbackTitle: "Safe But Small",
                        feedback: "You chose security. SRK almost did too. But he asked himself — if this film releases and I'm in the background, will I be proud? The answer was no."
                    },
                    {
                        text: "Take the independent lead — better to be the hero of a small story than a footnote in a big one.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "BET ON YOURSELF",
                        feedback: "You think exactly like SRK. He bet on himself with Deewana and won everything. The lead role in a small film is worth more than a cameo in a blockbuster."
                    },
                    {
                        text: "Reject both and keep auditioning for lead roles in mainstream films.",
                        next: 'choice_c',
                        score: -5,
                        feedbackTitle: "Standards Without Strategy",
                        feedback: "You have standards. SRK respected that impulse. But he also knew that zero income kills dreams faster than bad roles. Sometimes you take the step that keeps you in the game."
                    }
                ]
            },
            {
                id: 'choice_a',
                emotion: 'determination',
                bg: '/assets/bg_srk_age25.jpg',
                portrait: '/assets/portrait-srk-25.png.jpg',
                text: "The big film releases. You're barely noticed in the background. The money helped, but you're no closer to being a lead. SRK took Deewana (1992) as a lead — it released and made him a star overnight. He bet on himself when no one else would.",
                choices: [
                    {
                        text: "Take the independent lead role — bet on yourself now.",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "The Lead or Nothing",
                        feedback: "There will always be a safe option that almost feels right. SRK understood that almost right is completely wrong. When you know what you came for — don't settle."
                    }
                ]
            },
            {
                id: 'choice_c',
                emotion: 'determination',
                bg: '/assets/bg_srk_age25.jpg',
                portrait: '/assets/portrait-srk-25.png.jpg',
                text: "Months pass. Savings run out. You have to leave Mumbai and go back to Delhi. The independent film got made — without you. SRK took Deewana as a calculated bet and it changed everything. Staying in the game matters.",
                choices: [
                    {
                        text: "Return to Mumbai with a new strategy — take the next lead role available.",
                        next: 'lesson',
                        score: 8,
                        feedbackTitle: "Learning from the Fall",
                        feedback: "Sometimes you take the step that keeps you in the game. Zero income kills dreams faster than bad roles."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/bg_srk_age25.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "BET ON YOURSELF. There will always be a safe option that almost feels right. SRK understood that almost right is completely wrong. When you know what you came for — don't settle for anything less.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The King of Bollywood", feedback: "" }
                ]
            }
        ]
    }

,
    // AGE 19: Billie Eilish
    'lvl_age_19_billie': {
        title: "Fame Is Eating Me Alive",
        source: "Source: Billie Eilish interviews, 2020-2021",
        frames: [
            {
                id: 'intro',
                emotion: 'triumph',
                bg: '/assets/bg_billie_la.jpg',
                text: "Year: 2020. Los Angeles. You are 19. You just won 5 Grammy Awards in one night — the most by any artist your age in history. But you haven't slept properly in 6 months. You have body dysmorphia, depression and anxiety. Your management wants you to start your next album immediately. Your therapist says you need 6 months completely off.",
                choices: [
                    {
                        text: "A) Start the next album immediately — momentum in music is everything.",
                        next: 'momentum',
                        score: -5,
                        feedbackTitle: "Playing Empty",
                        feedback: "You chose momentum. Billie felt that pressure too. But she discovered that music made from an empty place sounds empty. What are you creating from right now — fullness or exhaustion?"
                    },
                    {
                        text: "B) Take 6 months completely off — mental health is the foundation of everything.",
                        next: 'rest',
                        score: 10,
                        feedbackTitle: "You Chose Yourself",
                        feedback: "Billie made this choice and it terrified her. The world kept moving without her for 6 months and she survived. So would you."
                    },
                    {
                        text: "C) Write music privately while publicly stepping back from appearances.",
                        next: 'middle',
                        score: 5,
                        feedbackTitle: "The Middle Path",
                        feedback: "Billie eventually did this too — she processed privately before sharing publicly. The question is whether you can truly rest while still creating."
                    }
                ]
            },
            {
                id: 'momentum',
                bg: '/assets/bg_billie_la.jpg',
                text: "The sessions start well, but the music feels hollow. Your collaborator Finneas notices you're not really present. The songs lack the raw honesty your fans love.",
                choices: [
                    {
                        text: "Pause. Be honest — you need to heal before you can create.",
                        next: 'rest',
                        score: 10,
                        feedbackTitle: "The Brave Pause",
                        feedback: "Stopping to heal takes more courage than pushing through."
                    }
                ]
            },
            {
                id: 'rest',
                emotion: 'calm',
                bg: '/assets/bg_billie_la.jpg',
                text: "Six months pass. You speak publicly about your mental health struggles. The world doesn't abandon you — millions write that your honesty saved them. Now you return to the studio, full.",
                choices: [
                    {
                        text: "Channel everything you felt into the new album.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Vulnerability Is Strength",
                        feedback: "Stopping to heal wasn't weakness. It was the most courageous thing you could do."
                    }
                ]
            },
            {
                id: 'middle',
                emotion: 'calm',
                bg: '/assets/bg_billie_la.jpg',
                text: "Writing privately helps. You process through lyrics what you can't say in interviews. Slowly the songs become honest again.",
                choices: [
                    {
                        text: "Share the music when you're truly ready.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Private Process, Public Impact",
                        feedback: "The authenticity you protected privately shines through publicly."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'calm',
                bg: '/assets/avatar_billie.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Happier Than Ever becomes your most critically acclaimed album. You proved that stopping, healing, and being honest about struggle isn't weakness — it's the most courageous thing a 19-year-old can do in front of the entire world. LESSON: VULNERABILITY IS STRENGTH.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Happier Than Ever", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: MrBeast
    'lvl_age_19_mrbeast': {
        title: "Drop Out or Keep Uploading",
        source: "Source: MrBeast (Jimmy Donaldson) interviews, 2017",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "Year: 2017. North Carolina. You are 19. You've been making YouTube videos for 5 years with almost no success — 30,000 subscribers. Your mom is begging you to go to college. You just had an idea for a video counting to 100,000. It will take days. It's ridiculous. College applications are due tomorrow.",
                choices: [
                    {
                        text: "A) Apply to college — have a backup plan, YouTube is too uncertain.",
                        next: 'college',
                        score: -5,
                        feedbackTitle: "The Safe Plan",
                        feedback: "You chose safety. Jimmy's mom wanted that for him too. But he asked himself — if YouTube fails, can I handle knowing I never truly tried? Can you?"
                    },
                    {
                        text: "B) Make the counting video — bet everything on your instinct.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "Delusional Confidence",
                        feedback: "You think like MrBeast. The ability to believe in something absurd long enough for the world to catch up is genuinely rare."
                    },
                    {
                        text: "C) Apply to college but keep making videos — do both until one wins.",
                        next: 'both',
                        score: 0,
                        feedbackTitle: "Half Commitment",
                        feedback: "Many successful YouTubers did this. But MrBeast discovered that half-commitment produces half-results. Sometimes the backup plan is what's holding you back."
                    }
                ]
            },
            {
                id: 'college',
                emotion: 'tension',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You enroll. Classes are fine. But every night you're watching YouTube analytics instead of studying. The idea for the counting video won't leave your head.",
                choices: [
                    {
                        text: "Drop out. Make the video you can't stop thinking about.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "The Itch You Can't Ignore",
                        feedback: "When an idea won't leave you alone, that's data."
                    }
                ]
            },
            {
                id: 'both',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You split your time. The videos are decent but not obsessive. You realize you're not giving either path everything.",
                choices: [
                    {
                        text: "Go all-in on YouTube. Make the absurd counting video.",
                        next: 'count',
                        score: 10,
                        feedbackTitle: "Full Send",
                        feedback: "Commitment is a prerequisite for breakthrough."
                    }
                ]
            },
            {
                id: 'count',
                emotion: 'tension',
                bg: '/assets/bg_mrbeast_nc.jpg',
                text: "You film for 40+ hours straight, counting to 100,000 on camera. Your team thinks you've lost your mind. You upload it anyway.",
                choices: [
                    {
                        text: "Hit publish and go to sleep.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Absurd Idea",
                        feedback: "Every world-changing idea looks stupid before it works."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'tension',
                bg: '/assets/avatar_mrbeast.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "The video goes viral. He never went to college. He now has 200+ million subscribers and has given away over $100 million. LESSON: ABSURD IDEAS CHANGE THE WORLD. Nobody thought it would work. That's exactly why it did.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Counting to Greatness", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Ritesh Agarwal
    'lvl_age_19_ritesh': {
        title: "The Dropout Founder",
        source: "Source: Ritesh Agarwal, OYO Rooms origin story, 2012",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "Year: 2012. India. You are 19. You dropped out of college after one semester. You've been traveling across India staying in budget hotels — all terrible. You have an idea: standardize them. But you have no money, no MBA, no experience. Just ₹2,000 in your pocket. The Thiel Fellowship is offering $100,000 to young entrepreneurs to NOT go to college.",
                choices: [
                    {
                        text: "A) Go back to college — build credibility first, then start the business.",
                        next: 'college',
                        score: -5,
                        feedbackTitle: "The Credential Trap",
                        feedback: "Will a degree solve the problem you see? If not, what are you waiting for?"
                    },
                    {
                        text: "B) Apply for the Thiel Fellowship — bet on yourself against the world's best young minds.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Swing for the Biggest Opportunity",
                        feedback: "Ritesh won the fellowship but knew he'd find another way if he lost. The application itself forced him to clarify his vision."
                    },
                    {
                        text: "C) Start small immediately — begin with one hotel, don't wait for permission.",
                        next: 'start_small',
                        score: 8,
                        feedbackTitle: "Action Over Planning",
                        feedback: "This is actually closest to what Ritesh did before the fellowship — he had already started testing with real hotels. Beginning small is never small."
                    }
                ]
            },
            {
                id: 'college',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "Back in college, the problem you saw on the road keeps gnawing at you. Every semester feels like delay. The market won't wait.",
                choices: [
                    {
                        text: "Drop out again. Apply for the Thiel Fellowship.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Permission Is a Trap",
                        feedback: "The world gives permission to people who don't need it."
                    }
                ]
            },
            {
                id: 'start_small',
                emotion: 'hope',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "You partner with one guesthouse owner. The results are promising. Now the Thiel Fellowship application is open — your real-world data makes your pitch stronger.",
                choices: [
                    {
                        text: "Apply to Thiel Fellowship with your proof of concept.",
                        next: 'thiel',
                        score: 10,
                        feedbackTitle: "Data + Ambition",
                        feedback: "Action created the evidence. The fellowship will amplify it."
                    }
                ]
            },
            {
                id: 'thiel',
                emotion: 'hope',
                bg: '/assets/bg_ritesh_india.jpg',
                text: "You make it through the grueling interview rounds. The final round is tomorrow. You're the youngest applicant and the only one from India.",
                choices: [
                    {
                        text: "Walk in and pitch the pain you lived through personally.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Founder-Market Fit",
                        feedback: "Your personal experience of the problem is your unfair advantage."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'hope',
                bg: '/assets/avatar_ritesh.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ritesh wins $100,000 and uses it to start OYO Rooms. By age 25 he became the world's youngest billionaire. LESSON: PERMISSION IS A TRAP. He had a problem he personally experienced and the audacity to solve it.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Youngest Billionaire", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Muhammad Ali
    'lvl_age_19_ali': {
        title: "Throw The Medal Away",
        source: "Source: Muhammad Ali, Rome Olympics 1960",
        frames: [
            {
                id: 'intro',
                emotion: 'anger',
                bg: '/assets/bg_ali_rome.jpg',
                text: "Year: 1960. Rome Olympics. You are 19. You just won the Olympic gold medal in boxing. You return home to Louisville as a hero. But at a restaurant, a white waiter refuses to serve you. You — an Olympic gold medalist — are told to use the back entrance. You are so disgusted you consider throwing your medal into the Ohio River.",
                choices: [
                    {
                        text: "A) Keep the medal — use your platform strategically to change things from inside.",
                        next: 'keep',
                        score: -5,
                        feedbackTitle: "Strategic Silence",
                        feedback: "Many great activists chose strategy over emotion and changed the world. But Ali believed that strategic silence in the face of humiliation becomes complicity over time."
                    },
                    {
                        text: "B) Throw it away — some symbols of a corrupt system should be rejected completely.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Refuse to Treasure It",
                        feedback: "Ali said 'I don't have to be what you want me to be.' Sometimes the most powerful statement is destruction of what no longer deserves to exist."
                    },
                    {
                        text: "C) Keep the medal but speak loudly and publicly about what happened.",
                        next: 'speak',
                        score: 7,
                        feedbackTitle: "Voice Over Symbol",
                        feedback: "Ali did this too — he never stopped speaking. But he felt the medal itself was a lie he couldn't hold in his hands."
                    }
                ]
            },
            {
                id: 'keep',
                bg: '/assets/bg_ali_rome.jpg',
                text: "You keep the medal for sponsorships. The money comes. But every time you hold it you think about that restaurant. The compromise eats at you.",
                choices: [
                    {
                        text: "Reject the lie. Throw it away and speak your truth.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Integrity Over Gold",
                        feedback: "What you refuse to accept defines you as much as what you achieve."
                    }
                ]
            },
            {
                id: 'speak',
                emotion: 'determination',
                bg: '/assets/bg_ali_rome.jpg',
                text: "Your words reach millions. But the medal sits heavy. You realize symbols matter — what you hold says something about what you believe.",
                choices: [
                    {
                        text: "Let it go. Into the river.",
                        next: 'throw',
                        score: 10,
                        feedbackTitle: "Actions Louder Than Words",
                        feedback: "The act became the most powerful speech of all."
                    }
                ]
            },
            {
                id: 'throw',
                emotion: 'determination',
                bg: '/assets/bg_ali_rome.jpg',
                text: "The medal hits the water. Your trainer calls you crazy. Your family says don't make trouble. But something inside you has never felt more free.",
                choices: [
                    {
                        text: "Stand by the decision. Your integrity is not negotiable.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Greatest",
                        feedback: "This act of defiance defined his entire identity."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_ali.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Ali became the greatest boxer AND the greatest activist of his generation. The world remembers him not just for his fights in the ring but for the fights he picked outside it. LESSON: YOUR INTEGRITY IS WORTH MORE THAN ANY TROPHY.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Float Like a Butterfly", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Dhruv Rathee
    'lvl_age_20_dhruv': {
        title: "Germany or India",
        source: "Source: Dhruv Rathee interviews and YouTube journey, 2014",
        frames: [
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg_dhruv_germany.png',
                text: "Year: 2014. Germany. You are 20, studying mechanical engineering on a scholarship. You started making YouTube videos about Indian politics — nobody is watching. You have 500 subscribers. A German company offers you a prestigious internship. But you feel a burning rage about misinformation spreading in India. Someone needs to speak up.",
                choices: [
                    {
                        text: "A) Focus on engineering — finish your degree, build security, then use your platform.",
                        next: 'engineering',
                        score: 5,
                        feedbackTitle: "Build the Foundation",
                        feedback: "Dhruv did this too. He graduated first. The discipline of engineering sharpened his research skills."
                    },
                    {
                        text: "B) Go all in on YouTube — India needs honest voices more than one more engineer.",
                        next: 'youtube',
                        score: -5,
                        feedbackTitle: "Too Soon",
                        feedback: "Passion without patience collapses. Dhruv kept studying AND kept making videos. Both disciplines fed each other."
                    },
                    {
                        text: "C) Do both — keep studying but upload consistently, let the audience decide.",
                        next: 'both',
                        score: 10,
                        feedbackTitle: "Build the Bridge While Crossing It",
                        feedback: "This is exactly what Dhruv did. By the time he had to choose, the choice was obvious."
                    }
                ]
            },
            {
                id: 'youtube',
                emotion: 'determination',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You quit your studies. Without credentials, your videos struggle to be taken seriously. You realize authority and research depth matter for this kind of content.",
                choices: [
                    {
                        text: "Go back. Finish the degree while continuing to upload.",
                        next: 'both',
                        score: 10,
                        feedbackTitle: "Patience Is Architecture",
                        feedback: "Patience in the building phase is not weakness."
                    }
                ]
            },
            {
                id: 'engineering',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You graduate. Your degree gives you credibility. Now you have the research skills AND the credentials. The YouTube channel is still small but growing steadily.",
                choices: [
                    {
                        text: "Go full-time on YouTube — the time is right.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Obvious Choice",
                        feedback: "By the time you had to choose, the choice was obvious."
                    }
                ]
            },
            {
                id: 'both',
                emotion: 'determination',
                bg: '/assets/bg_dhruv_germany.png',
                text: "You study by day and research-write by night. The videos are slow but consistent. Your engineering brain makes your research unusually rigorous.",
                choices: [
                    {
                        text: "Graduate, then go all-in.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Long Game",
                        feedback: "20 million subscribers are waiting on the other side of patience."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_dhruv.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Today Dhruv Rathee has 20+ million subscribers and is one of India's most influential voices on democracy and environment. LESSON: BUILD THE BRIDGE WHILE CROSSING IT. Patience in the building phase is not weakness — it's architecture.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "20 Million Strong", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Narendra Modi
    'lvl_age_20_modi': {
        title: "The Canteen and the Calling",
        source: "Source: BJP Biography, The Economic Times & Andy Marino (2014)",
        frames: [
            {
                id: 'intro',
                emotion: 'seeking',
                bg: '/assets/bg_Narendra Modi.jpg',
                portrait: '/assets/avatar_Narendra Modi.jpg',
                text: "After spending two years wandering the Himalayas and visiting ashrams in search of spiritual truth, your reality has abruptly shifted. At 20, you are back in the noisy, grueling environment of a city. You are living in Ahmedabad, working at a bustling canteen at the Geeta Mandir bus depot run by your family. From dawn to dusk, you serve tea to weary travelers. Yet, your mind remains restless. In your free time, you volunteer at the local Rashtriya Swayamsevak Sangh (RSS) headquarters—sweeping floors and making tea for senior organizers. You know you want your life to mean something bigger, but you are torn on how to actually channel your energy.\n\nYour spiritual journey changed you, but now you must make a definitive choice about how to spend your life's energy in the real world.",
                choices: [
                    {
                        text: "A) Return to the monasteries to become a traditional monk.",
                        next: 'monk_path',
                        score: 5,
                        feedbackTitle: "Spiritual Seeking",
                        feedback: "The spiritual pull is immense and offers deep internal peace, but it isolates you from the immediate, daily struggles of the people you want to help."
                    },
                    {
                        text: "B) Focus on building a secure life through the canteen business.",
                        next: 'canteen_path',
                        score: 5,
                        feedbackTitle: "Financial Security",
                        feedback: "It is the expected path, offering financial stability and family approval, but it feels far too small for the fire burning inside you."
                    },
                    {
                        text: "C) Commit fully to the RSS as a grassroots organizer (pracharak).",
                        next: 'pracharak_path',
                        score: 10,
                        feedbackTitle: "Austere Service",
                        feedback: "This path demands extreme austerity, constant travel, and abandoning any prospect of personal wealth or family life, but it allows you to serve the nation directly."
                    }
                ]
            },
            {
                id: 'monk_path',
                emotion: 'uncertainty',
                bg: '/assets/bg_Narendra Modi.jpg',
                portrait: '/assets/avatar_Narendra Modi.jpg',
                text: "You realize that retreating from the world won't solve its problems. A mentor advises you that true spirituality is found in serving people where they suffer most. You decide that your spiritual energy must be converted into social action.",
                choices: [
                    {
                        text: "Channel spiritual ideals into disciplined grassroots service.",
                        next: 'pracharak_path',
                        score: 10,
                        feedbackTitle: "Action Step",
                        feedback: "True purpose requires translating high ideals into practical daily work."
                    }
                ]
            },
            {
                id: 'canteen_path',
                emotion: 'tension',
                bg: '/assets/bg_Narendra Modi.jpg',
                portrait: '/assets/avatar_Narendra Modi.jpg',
                text: "The security of the canteen brings routine, but the restlessness never fades. You quickly realize that financial comfort cannot substitute for a life of purpose. You step away from the business to seek a role that impacts society at large.",
                choices: [
                    {
                        text: "Step away from comfort and commit to the larger mission.",
                        next: 'pracharak_path',
                        score: 10,
                        feedbackTitle: "Action Step",
                        feedback: "Comfort cannot substitute for a calling."
                    }
                ]
            },
            {
                id: 'pracharak_path',
                emotion: 'determination',
                bg: '/assets/bg_Narendra Modi.jpg',
                portrait: '/assets/avatar_Narendra Modi.jpg',
                text: "You embrace the grueling life of a pracharak. You realize that changing a nation requires more than spiritual philosophy—it requires relentless, organized, unglamorous hard work. You take the oath of service, accepting a life of strict discipline that will ultimately shape your entire future and the future of the country.",
                choices: [
                    {
                        text: "Reflect on the Path of Purpose",
                        next: 'lesson',
                        score: 10,
                        feedbackTitle: "The Calling Embraced",
                        feedback: "Grueling discipline and service become the crucible of leadership."
                    }
                ]
            },
            {
                id: 'lesson',
                emotion: 'determination',
                bg: '/assets/avatar_Narendra Modi.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_Narendra Modi.jpg',
                text: "At 20, Narendra Modi moved from the bus depot canteen to full-time national service as an RSS pracharak, living with absolute austerity and discipline.\n\nLESSONS:\n1. True purpose often lies at the intersection of your highest ideals and the gritty reality of everyday work.\n2. Serving a massive cause requires grueling discipline, not just good intentions.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 20 (shown as 19 in-game): Falguni Nayar
    'lvl_age_19_falguni': {
        title: "Science or Business",
        source: "Source: Falguni Nayar, IIM Ahmedabad and Nykaa origin story, 1982",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "Year: 1982. Mumbai. You are 19, one of very few women at IIM Ahmedabad. Society expects you to get a safe job and marry. You have a burning desire to build something of your own someday. Everyone says: get experience first, build credentials. Your family wants a good job first.",
                choices: [
                    {
                        text: "A) Follow the conventional path — job, experience, credentials, then entrepreneurship later.",
                        next: 'conventional',
                        score: 10,
                        feedbackTitle: "The Best MBA She Ever Got",
                        feedback: "You and Falguni made the same choice. She called those 19 years at Kotak 'the best MBA I ever got.' Experience isn't delay — it's preparation disguised as patience."
                    },
                    {
                        text: "B) Start something immediately — youth and energy are your greatest assets.",
                        next: 'start_now',
                        score: 5,
                        feedbackTitle: "Starting Young Works Too",
                        feedback: "Some of India's greatest founders did exactly this — Ritesh Agarwal, Kunal Shah. The question is what you're starting with."
                    },
                    {
                        text: "C) Use your IIM network aggressively — build connections that will support your future venture.",
                        next: 'network',
                        score: 8,
                        feedbackTitle: "Networks Are Your Future",
                        feedback: "Falguni did this naturally — her Kotak connections became Nykaa's first investors. Networks aren't just contacts — they're your future."
                    }
                ]
            },
            {
                id: 'start_now',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "You start early but lack industry knowledge and connections. The venture struggles. You realize you needed more domain expertise.",
                choices: [
                    {
                        text: "Get corporate experience first. Build knowledge intentionally.",
                        next: 'conventional',
                        score: 10,
                        feedbackTitle: "The Long Game",
                        feedback: "There is no wrong time to begin — but preparation compounds."
                    }
                ]
            },
            {
                id: 'network',
                emotion: 'calm',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "Your IIM connections open doors at Kotak Mahindra. You join. Over 19 years you build expertise AND relationships that will become Nykaa's backbone.",
                choices: [
                    {
                        text: "At 49, launch Nykaa using everything you built.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Network Pays Off",
                        feedback: "Every relationship you built was Nykaa's foundation."
                    }
                ]
            },
            {
                id: 'conventional',
                emotion: 'calm',
                bg: '/assets/bg_falguni_iim.jpg',
                text: "You join Kotak Mahindra. 19 years of investment banking builds your expertise, your network, and your understanding of capital markets — the exact skills Nykaa will need.",
                choices: [
                    {
                        text: "At 49, launch Nykaa. The window was never closed.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "49 and Just Beginning",
                        feedback: "India's first self-made female billionaire. And she started her company at 49."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'calm',
                bg: '/assets/avatar_falguni.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Falguni Nayar became India's first self-made female billionaire in 2021. She founded Nykaa at 49. LESSON: THERE IS NO WRONG TIME TO BEGIN. The entrepreneurship window never closes.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "Never Too Late", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Nikola Tesla
    'lvl_age_19_tesla': {
        title: "Trust Your Visions",
        source: "Source: Nikola Tesla autobiography, Graz Institute of Technology, 1875",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "Year: 1875. Austria. You are 19, studying electrical engineering. You are obsessed — studying 20 hours a day. You've started having visions: literal visualizations of electrical machines in your mind that you can mentally test. Your professors think you're having a mental crisis. You have a revolutionary idea about alternating current that contradicts everything they teach.",
                choices: [
                    {
                        text: "A) Trust your professors — they have decades of experience, your visions might be delusions.",
                        next: 'professors',
                        score: -10,
                        feedbackTitle: "The Safe Mind",
                        feedback: "Deference to authority killed the idea before it could become the modern world's power grid."
                    },
                    {
                        text: "B) Trust your visions — your mind is showing you something the world hasn't seen yet.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "The Mind That Sees Differently",
                        feedback: "Tesla later said those mental visualizations were more real to him than physical experiments."
                    },
                    {
                        text: "C) Document everything secretly — protect your ideas while appearing to conform.",
                        next: 'document',
                        score: 7,
                        feedbackTitle: "Hidden Fire",
                        feedback: "Strategic patience can protect a revolutionary idea until the moment is right."
                    }
                ]
            },
            {
                id: 'professors',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You follow the curriculum. Years pass. You work at a telegraph company. The vision of alternating current never leaves. You realize you suppressed your greatest insight.",
                choices: [
                    {
                        text: "Trust the vision. Document it. Pursue it.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "Reclaiming the Vision",
                        feedback: "Better late than never for a mind like yours."
                    }
                ]
            },
            {
                id: 'document',
                emotion: 'determination',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You secretly fill notebooks with AC designs while passing your exams. You're building a double life — conformist by day, revolutionary by night.",
                choices: [
                    {
                        text: "The time has come. Reveal the alternating current system.",
                        next: 'visions',
                        score: 10,
                        feedbackTitle: "From Hidden to Historic",
                        feedback: "The patience made the revelation more powerful."
                    }
                ]
            },
            {
                id: 'visions',
                emotion: 'determination',
                bg: '/assets/bg_tesla_austria.jpg',
                text: "You trust the visions completely. Your professors call it a breakdown. But you can see the machine working in your mind with perfect clarity — every coil, every spark, every rotation.",
                choices: [
                    {
                        text: "Build it. Prove the vision was real.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Reality Distortion",
                        feedback: "The vision was more real than anything in the lab."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_tesla.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "Tesla's alternating current system powers the entire modern world. LESSON: THE MIND THAT SEES DIFFERENTLY IS NOT BROKEN. The ability to see what doesn't exist yet — and trust that vision enough to fight for it — is the rarest human gift.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 10, feedbackTitle: "The Current That Lights the World", feedback: "" }
                ]
            }
        ]
    },
    // AGE 19: Shubman Gill
    'lvl_age_19_shubman': {
        title: "The New Prince",
        source: "Source: 2018-2019 New Zealand Tour",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "2018-2019. You’ve just won the U-19 World Cup. You are being hailed as the 'Next Kohli.' Suddenly, you are thrown into the senior Indian team in New Zealand. You fail. You score 9 and 7. The media says you were 'hyped too early.'",
                choices: [
                    {
                        text: "Go back to domestic cricket. Play it safe to find form away from the media glare.",
                        next: 'domestic',
                        score: -5,
                        feedbackTitle: "Retreat to the Shadows",
                        feedback: "You find form, but you miss the crucial window of international exposure. You become a domestic giant but an international spectator."
                    },
                    {
                        text: "Demand to stay in the high-pressure international environment despite the crushing criticism.",
                        next: 'international',
                        score: 10,
                        feedbackTitle: "Trial By Fire",
                        feedback: "You accept that international cricket is unforgiving. You decide that the only way to beat the pressure is to live inside it."
                    }
                ]
            },
            {
                id: 'domestic',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "Domestic cricket is easy for you, but when you return to the international stage, the same doubts creep back in.",
                choices: [
                    {
                        text: "Realize you must face the heat. Push for an international return.",
                        next: 'international',
                        score: 10,
                        feedbackTitle: "Second Chance",
                        feedback: "You realize avoiding failure is the same as avoiding growth."
                    },
                    {
                        text: "Accept your fate as a domestic legend.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "The Unfulfilled Prophecy",
                        feedback: "You are remembered as a 'what if'."
                    }
                ]
            },
            {
                id: 'international',
                emotion: 'determination',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "The criticism gets louder. Former players question your technique against swing bowling. Your confidence is completely shattered.",
                choices: [
                    {
                        text: "Completely change your batting technique to please the critics.",
                        next: 'change_technique',
                        score: -5,
                        feedbackTitle: "Losing Yourself",
                        feedback: "You lose your natural flair. You become a rigid, defensive player who survives but never dominates."
                    },
                    {
                        text: "Trust the process. Make minor adjustments, but back the aggressive style that got you here.",
                        next: 'trust_process',
                        score: 10,
                        feedbackTitle: "Unyielding Belief",
                        feedback: "You trust your hands. You trust your eye. You block the noise and focus on the ball."
                    }
                ]
            },
            {
                id: 'change_technique',
                emotion: 'determination',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "Your mind is cluttered. You forgot how to play your natural game.",
                choices: [
                    {
                        text: "Revert to your instinct. Trust what made you a prodigy.",
                        next: 'trust_process',
                        score: 10,
                        feedbackTitle: "Return to Instinct",
                        feedback: "You strip away the unnecessary advice and go back to basics."
                    }
                ]
            },
            {
                id: 'trust_process',
                emotion: 'determination',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "You are selected for the historic Gabba Test in Australia. The pitch is lethal, the bowlers are breathing fire, and history is on the line.",
                choices: [
                    {
                        text: "Play a counter-attacking innings. Take the game to the Australians.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Gabba Masterclass",
                        feedback: "You score a breathtaking 91. You lay the foundation for one of the greatest Test wins in history."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_shubman.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You silenced the critics not with words, but with a bat. You proved that early failure is just the entry fee for greatness.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'determination',
                bg: '/assets/avatar_shubman.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You let the pressure dictate your potential.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SHUBMAN',
                emotion: 'determination',
                bg: '/assets/bg_shubman_nz.jpg',
                text: "LESSON: Conviction. When everyone writes you off, the only voice that matters is your own. Trust the talent that brought you to the arena.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Prajakta Koli
    'lvl_age_20_prajakta': {
        title: "The 2 AM Panic",
        source: "Source: Finding My Purpose",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_prajakta_silence.jpg',
                text: "2014. Mumbai.\nYou are 20. For ten years, your only dream was to be a Radio Jockey (RJ). You finally got the internship at a major station. This is it. But it's a nightmare. You're exhausted, the creative freedom is zero, and you realize the \"dream\" was a lie. You meet a talent scout who sees your funny personality and says, \"Quit. Start a YouTube channel.\"\nIt's 2014. In India, \"YouTuber\" isn't a career—it's what people do when they're unemployed. Your parents expect you to have a 'real' job.\nWhat do you do?",
                choices: [
                    {
                        text: "Finish the internship — You worked 10 years for this. Don't throw it away for a \"hobby\" website.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Sunk Cost",
                        feedback: "You stick it out but are miserable. Your creative spark dies."
                    },
                    {
                        text: "The Leap of Faith — Quit the station tomorrow. No backup plan. Just a camera and your room.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Taking the Leap",
                        feedback: "You take a massive risk, trading a 'prestigious' title for a 'silly' YouTube channel."
                    },
                    {
                        text: "Do both — Work the 12-hour RJ shift and try to make videos at 2 AM when you're exhausted.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "Burnout",
                        feedback: "You burn out completely. Neither your radio show nor your videos succeed."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'hope',
                bg: '/assets/avatar_prajakta.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What actually happened: After a \"mental breakdown\" at the radio station, Prajakta quit. She felt she was failing her lifelong dream, but she realized the medium (Radio) was wrong, even if the goal (connecting with people) was right.",
                choices: [
                    {
                        text: "See Lesson",
                        next: 'LEARNING_PRAJAKTA',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'hope',
                bg: '/assets/avatar_prajakta.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You chose the comfort of the known over the magic of the unknown.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_PRAJAKTA',
                emotion: 'hope',
                bg: '/assets/bg_prajakta_silence.jpg',
                text: "LESSON: DON'T CLING TO A MISTAKE JUST BECAUSE YOU SPENT A LONG TIME MAKING IT.\nShe traded a \"prestigious\" title for a \"silly\" YouTube channel. Today, she has 7M+ subscribers and has spoken at the UN.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Viswanathan Anand
    'lvl_age_18_anand': {
        title: "The Lightning Kid",
        source: "Source: World Junior Chess Championship 1987",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg_anand_chess.jpg',
                text: "1987. You are 18. You are the first Indian to ever win the World Junior Chess Championship. The 'Grandmasters' in Europe don't take you seriously because you play too fast—they call you 'The Coffee-Shop Player'.",
                choices: [
                    {
                        text: "Change your natural, fast style to 'fit in' with the slow, analytical European Grandmasters.",
                        next: 'slow_down',
                        score: -5,
                        feedbackTitle: "Losing Your Edge",
                        feedback: "You slow down. You try to play their game. You lose your unique rhythm and become just another average player."
                    },
                    {
                        text: "Double down on your speed. Overwhelm them with your natural instinct.",
                        next: 'speed',
                        score: 10,
                        feedbackTitle: "The Lightning Strike",
                        feedback: "You embrace your intuition. You calculate faster than they can comprehend, putting immense psychological pressure on them."
                    }
                ]
            },
            {
                id: 'slow_down',
                bg: '/assets/bg_anand_chess.jpg',
                text: "You are losing matches because you are constantly second-guessing your initial, brilliant instincts.",
                choices: [
                    {
                        text: "Return to your natural speed. Trust your intuition.",
                        next: 'speed',
                        score: 10,
                        feedbackTitle: "Reclaiming the Rhythm",
                        feedback: "You realize your speed is a weapon, not a flaw."
                    },
                    {
                        text: "Keep trying to force the slow style.",
                        next: 'fail',
                        score: -10,
                        feedbackTitle: "The Dull Blade",
                        feedback: "You fade into chess obscurity."
                    }
                ]
            },
            {
                id: 'speed',
                bg: '/assets/bg_anand_chess.jpg',
                text: "You reach the senior level. Your speed is devastating, but against the absolute best (like Kasparov), a single fast mistake costs you the match.",
                choices: [
                    {
                        text: "Refuse to adapt. Blame bad luck.",
                        next: 'stubborn',
                        score: -5,
                        feedbackTitle: "The Plateau",
                        feedback: "Speed without control is reckless. You hit a ceiling."
                    },
                    {
                        text: "Keep the speed, but develop deep opening preparation. Combine intuition with rigorous study.",
                        next: 'mastery',
                        score: 10,
                        feedbackTitle: "The Complete Player",
                        feedback: "You spend thousands of hours studying openings. You now play fast *and* flawlessly."
                    }
                ]
            },
            {
                id: 'stubborn',
                emotion: 'calm',
                bg: '/assets/bg_anand_chess.jpg',
                text: "You realize you can't beat the World Champion on instinct alone.",
                choices: [
                    {
                        text: "Accept the grind. Study the theory.",
                        next: 'mastery',
                        score: 10,
                        feedbackTitle: "Humility",
                        feedback: "You do the boring work to protect your brilliant instincts."
                    }
                ]
            },
            {
                id: 'mastery',
                emotion: 'calm',
                bg: '/assets/bg_anand_chess.jpg',
                text: "You face the elite. With your refined speed and flawless preparation, you conquer the chess world, winning the World Championship 5 times across all formats.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'calm',
                bg: '/assets/avatar_anand.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You became a legend not by copying the Europeans, but by forcing the world to respect the Indian style of play.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'calm',
                bg: '/assets/avatar_anand.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You let others define how you should play your own game.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_ANAND',
                emotion: 'calm',
                bg: '/assets/bg_anand_chess.jpg',
                text: "LESSON: Uniqueness. Never apologize for your natural style. Refine it, protect it, but never abandon it to look 'normal' to the establishment.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Zendaya
    'lvl_age_18_zendaya': {
        title: "The Identity Strike",
        source: "Source: Confidence & Fear",
        frames: [
            {
                id: 'intro',
                emotion: 'anger',
                bg: '/assets/bg_zendaya_boardroom.jpg',
                text: "2014. Hollywood.\nYou are 18. You are a Disney star with a massive following, but you feel like a puppet. You are cast in a new show, K.C. Undercover. The script is \"classic Disney\"—you’re a girl who is clumsy, can’t dance, and is obsessed with boys.\nThe producers tell you, \"This is what works. Don't break the formula.\" But you know this isn't who you are, and it isn't what girls need to see. You want the character to be a martial artist, a tech-wiz, and socially awkward—a real person.\nThey tell you to just \"be grateful\" for the lead role.\nWhat do you do?",
                choices: [
                    {
                        text: "Accept the role — Secure your fame and money first. You can change things when you’re 25.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Hollow Crown",
                        feedback: "You get the fame, but you remain a puppet. Your creative voice is never heard."
                    },
                    {
                        text: "Walk away — If they don't give you \"Producer\" status and creative control, you quit Disney entirely.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Taking the Reins",
                        feedback: "The executives are shocked. It's a massive risk for an 18-year-old, but you stand your ground."
                    },
                    {
                        text: "Negotiate a middle ground — Change some lines but keep the \"safe\" Disney formula to avoid a fight.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Compromise",
                        feedback: "You change a few lines, but the core stereotype remains. You still feel like a puppet."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_zendaya.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What actually happened: Zendaya refused to do the show unless she was made a Producer at age 18. She demanded the character be empowered and the title changed. She risked being \"blacklisted\" by the biggest studio in the world to ensure she wasn't just another teen idol.",
                choices: [
                    {
                        text: "See Lesson",
                        next: 'LEARNING_ZENDAYA',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'determination',
                bg: '/assets/avatar_zendaya.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You stayed in the background when it was time to step up.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_ZENDAYA',
                emotion: 'determination',
                bg: '/assets/bg_zendaya_boardroom.jpg',
                text: "LESSON: POWER ISN'T GIVEN, IT'S TAKEN.\nShe knew her value. By demanding a seat at the table early, she transitioned from \"Disney Kid\" to the most respected actress of her generation.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Neeraj Chopra
    'lvl_age_19_neeraj': {
        title: "The Lonely Flight",
        source: "Source: Motivation & Drive",
        frames: [
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg_neeraj_track.jpg',
                audio: '/assets/voice_neeraj_intro.mp3',
                text: "2016. Poland/India.\nYou are 19. You just threw the Javelin 86.48m—a World Junior Record. You are the first Indian athlete to ever hold a world record. You are a national hero.\nBut there is a catch. The Olympic qualification deadline passed just a few days ago. Even though you are literally one of the best in the world, you cannot go to the Rio Olympics.\nThe \"system\" tells you to stay in India, do the celebrity award shows, and wait for the next four years. Your body is tired, and the hype is distracting.\nWhat do you do?",
                choices: [
                    {
                        text: "Enjoy the fame — Use your new status to sign big brand deals and secure your family's future.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Comfort Zone",
                        feedback: "You enjoy the spotlight, but your training suffers. The lack of elite competition stalls your growth."
                    },
                    {
                        text: "The \"Monk\" Path — Leave India. Go to a remote training center in Europe where nobody knows your name, live in a small room, and train in total silence for years.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "The Path of Mastery",
                        feedback: "You leave the fame behind. You find yourself alone in a misty stadium, entirely focused on the process."
                    },
                    {
                        text: "Join the Army — Take a stable government job (Subedar) and train part-time while serving.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Compromise",
                        feedback: "You secure your future, but your training time is split. You plateau on the world stage."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'determination',
                bg: '/assets/avatar_neeraj.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What actually happened: Neeraj chose the \"Monk\" Path. Instead of basking in the Indian media's attention, he disappeared into elite international training camps. He lived a lonely, grueling life away from home for years.",
                choices: [
                    {
                        text: "See Lesson",
                        next: 'LEARNING_NEERAJ',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'determination',
                bg: '/assets/avatar_neeraj.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You chose short-term comfort over long-term glory.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_NEERAJ',
                emotion: 'determination',
                bg: '/assets/bg_neeraj_track.jpg',
                text: "LESSON: FAME IS A DISTRACTION; MASTERY IS THE GOAL.\nWhile others were celebrating his \"Junior\" record, he was already training for \"Senior\" gold. That isolation is what turned a 19-year-old talent into an Olympic Champion.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Selena Gomez
    'lvl_age_20_selena': {
        title: "The Invisible War",
        source: "Source: Heartbreak & Relationships",
        frames: [
            {
                id: 'intro',
                emotion: 'fear',
                bg: '/assets/bg_selena_spotlight.jpg',
                text: "2012-2013. Global Tour.\nYou are 20. To the world, you have everything: a hit album, a famous boyfriend, and a perfect life.\nBut behind the scenes, your body is failing. You’ve been diagnosed with Lupus, an autoimmune disease. You are in pain, your hair is thinning, and you need chemotherapy.\nThe tabloids are brutal. They say you’re \"going to rehab\" for drugs or \"acting crazy\" because of a breakup. If you tell the truth, you look \"weak\" and might lose your tour contracts. If you stay silent, the world thinks you’re a mess.\nWhat do you do?",
                choices: [
                    {
                        text: "Stay Silent — Protect your \"perfect\" image. Let people think what they want; your health is private.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "The Breaking Point",
                        feedback: "You try to maintain the facade, but your body gives out. The rumors only get worse."
                    },
                    {
                        text: "The Radical Truth — Cancel the tour. Go public. Tell the world you have a chronic illness, even if it breaks the \"pop star\" illusion.",
                        next: 'success',
                        score: 10,
                        feedbackTitle: "Vulnerability as Strength",
                        feedback: "You step away from the spotlight. The truth is shocking, but it sets you free from the toxic rumors."
                    },
                    {
                        text: "Push Through — Take the meds, hide the pain, and finish the tour. You can't let your fans or your label down.",
                        next: 'fail',
                        score: -5,
                        feedbackTitle: "Physical Collapse",
                        feedback: "You push your body too far and end up hospitalized, forcing a cancellation anyway."
                    }
                ]
            },
            {
                id: 'success',
                emotion: 'calm',
                bg: '/assets/avatar_selena.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "What actually happened: Selena disappeared from the spotlight to undergo chemotherapy. When she returned, she didn't hide it. She became a face for Lupus awareness and mental health, even showing her surgery scars.",
                choices: [
                    {
                        text: "See Lesson",
                        next: 'LEARNING_SELENA',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'fail',
                emotion: 'calm',
                bg: '/assets/avatar_selena.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                text: "You let the pressure of the spotlight destroy your well-being.",
                choices: [
                    {
                        text: "Try Again",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_SELENA',
                emotion: 'calm',
                bg: '/assets/bg_selena_spotlight.jpg',
                text: "LESSON: VULNERABILITY IS THE ULTIMATE STRENGTH.\nShe realized that her \"perfect\" image was a cage. By being honest about her pain, she built a deeper connection with millions of people that a \"perfect\" pop star never could.",
                choices: [
                    { text: "Finish Chapter", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 20: Billie Eilish — "The Person Who Left You On Seen"
    'lvl_age_20_billie_2': {
        title: "The Person Who Left You On Seen",
        source: "Source: Billie Eilish's relationships and music",
        frames: [
            {
                id: 'intro',
                emotion: 'love',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                portrait: '/assets/portrait-billie-20.png',
                text: "It's 2022. You are 20. Your songs are everywhere. Millions think you are living a dream life. But every night ends the same way. Waiting for one person to reply. Tonight, they leave your message on seen again. Thirty minutes later, you see them laughing with someone else on Instagram Live. Your stomach drops.",
                choices: [
                    {
                        text: "Double text: 'Are you avoiding me?'",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Fear vs Love",
                        feedback: "You reached out from fear not love. Billie learned that chasing someone who chooses distance is a form of self-abandonment."
                    },
                    {
                        text: "Post a story pretending you're having fun too",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Masking",
                        feedback: "You try to mask the pain, but the silence still hurts."
                    },
                    {
                        text: "Throw the phone away and start writing music",
                        next: 'scene_2B',
                        score: 15,
                        feedbackTitle: "Creation",
                        feedback: "You chose creation over desperation. This is exactly what Billie did. Pain that becomes art stops being just pain."
                    },
                    {
                        text: "Block them everywhere to protect yourself before they can hurt you again",
                        next: 'scene_2A',
                        score: 15,
                        feedbackTitle: "Protection",
                        feedback: "You chose protection. Billie understood this eventually — sometimes the most loving thing you can do for yourself is remove access."
                    },
                    {
                        text: "Stay silent and wait to see if they come back",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Hope",
                        feedback: "You chose hope over action. The hardest truth — silence from someone who wants to reach you lasts minutes. Silence from someone who doesn't lasts forever."
                    }
                ]
            },
            {
                id: 'scene_2A',
                emotion: 'grief',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                portrait: '/assets/portrait-billie-20.png',
                text: "Three dots appear instantly. 'You overthink everything. I can't breathe around you anymore.' You reread the message again and again. Part of you wants to apologize. Part of you wants to scream. You know if you keep chasing them, you may lose your self-respect completely. But losing them feels worse.",
                choices: [
                    {
                        text: "Send a huge emotional paragraph explaining yourself",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Emotional Flood",
                        feedback: ""
                    },
                    {
                        text: "Reply: 'Then leave.'",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Defensive Anger",
                        feedback: ""
                    },
                    {
                        text: "Ask honestly: 'Did you ever actually love me?'",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Desperate Vulnerability",
                        feedback: ""
                    },
                    {
                        text: "Delete the chat without replying",
                        next: 'LEARNING_LESSON',
                        score: 15,
                        feedbackTitle: "Silence",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'scene_2B',
                emotion: 'grief',
                bg: '/assets/bg-billie-studio-3am-2022.png',
                portrait: '/assets/portrait-billie-20.png',
                text: "At 3:12 AM, your room is dark except for your laptop screen. The pain slowly turns into lyrics. Every sentence feels personal. Dangerous. Your producer listens quietly and says: 'This could become your biggest song.' You suddenly freeze. If you release it, the world will know exactly who hurt you.",
                choices: [
                    {
                        text: "Release it exactly as written",
                        next: 'LEARNING_LESSON',
                        score: 15,
                        feedbackTitle: "Raw Honesty",
                        feedback: ""
                    },
                    {
                        text: "Change the lyrics to protect them",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Protection",
                        feedback: ""
                    },
                    {
                        text: "Never release it — too vulnerable",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Self-Protection",
                        feedback: ""
                    },
                    {
                        text: "Perform it live without telling anyone who it's about",
                        next: 'LEARNING_LESSON',
                        score: 15,
                        feedbackTitle: "Subtle Art",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_LESSON',
                emotion: 'grief',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                text: "LESSON: THE COST OF ATTACHMENT. Billie later spoke openly about unhealthy attachment and losing herself emotionally in relationships. Sometimes heartbreak is not losing someone else. Sometimes it's realizing how much of yourself you sacrificed to keep them. The most painful truth: you can love someone deeply and still be completely wrong for each other.",
                choices: [
                    { text: "Ponder", next: 'reflection_1', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_1',
                emotion: 'grief',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                text: "Reflection: Is emotional dependence a form of love or a loss of identity?",
                choices: [
                    { text: "Next", next: 'reflection_2', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_2',
                emotion: 'grief',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                text: "Reflection: If someone triggers your anxiety constantly, why is leaving them so difficult?",
                choices: [
                    { text: "Next", next: 'reflection_3', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_3',
                emotion: 'grief',
                bg: '/assets/bg-billie-bedroom-night-2022.png',
                text: "Reflection: Would you rather be loved deeply by one person or admired by millions?",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 19: Justin Bieber — "The Hotel Room at 2AM"
    'lvl_age_19_justin': {
        title: "The Hotel Room at 2AM",
        source: "Source: Justin Bieber's early career struggles",
        frames: [
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                portrait: '/assets/portrait-justin-19.png',
                text: "It's 2013. You are 19. You are one of the most famous people on Earth. Crowds scream your name. Headlines follow your every move. But your relationship is collapsing in public. Every fight becomes trending news. Tonight, after another argument, you sit alone in a hotel room staring at your phone. One text could restart everything. Or destroy you again.",
                choices: [
                    {
                        text: "Text: 'I miss you.'",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Comfort",
                        feedback: "You reached for comfort. Justin did too. But he later realized missing someone and loving them are completely different feelings that feel identical at 2AM."
                    },
                    {
                        text: "Drive through the city alone at 2AM",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Escape",
                        feedback: "You try to escape, but the thoughts follow you."
                    },
                    {
                        text: "Go to the studio and bury yourself in music",
                        next: 'scene_2B',
                        score: 15,
                        feedbackTitle: "Creation",
                        feedback: "You chose creation. Justin's best work came from his worst nights. Pain processed through art becomes something the world can use."
                    },
                    {
                        text: "Turn your phone off completely and disappear",
                        next: 'scene_2B',
                        score: 15,
                        feedbackTitle: "Distance",
                        feedback: "You chose distance. Justin eventually learned that silence from the world was the only way to hear himself think. Sometimes disappearing is not running away — it is finding yourself."
                    },
                    {
                        text: "Call them even though you know it will become another fight",
                        next: 'scene_2A',
                        score: 10,
                        feedbackTitle: "Chaos",
                        feedback: "You reach for familiar chaos over unfamiliar peace."
                    }
                ]
            },
            {
                id: 'scene_2A',
                emotion: 'anger',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                portrait: '/assets/portrait-justin-19.png',
                text: "They reply instantly. For a second, it feels warm. Familiar. Then the argument starts again. Old jealousy. Old accusations. Old pain neither of you fixed. You suddenly realize something terrifying: You don't know whether you miss THEM... or just the feeling of not being alone.",
                choices: [
                    {
                        text: "Keep fighting for the relationship no matter how toxic it becomes",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Clinging",
                        feedback: ""
                    },
                    {
                        text: "End things even if it emotionally destroys you",
                        next: 'LEARNING_LESSON',
                        score: 15,
                        feedbackTitle: "Painful Truth",
                        feedback: ""
                    },
                    {
                        text: "Ask for a break instead of a breakup",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Delaying",
                        feedback: ""
                    },
                    {
                        text: "Stay together because the highs still feel magical",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Addiction",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'scene_2B',
                emotion: 'anger',
                bg: '/assets/bg-justin-studio-night-2013.png',
                portrait: '/assets/portrait-justin-19.png',
                text: "The studio is silent except for the beat playing through the speakers. You record for hours without stopping. The producer finally says: 'You sound angry.' You stare at the mic. Because the truth is... you ARE angry. At them. At yourself. At the pressure of pretending to be okay while falling apart internally.",
                choices: [
                    {
                        text: "Turn the pain into your best song yet",
                        next: 'LEARNING_LESSON',
                        score: 15,
                        feedbackTitle: "Channeling",
                        feedback: ""
                    },
                    {
                        text: "Leave halfway because the emotions are too overwhelming",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Overwhelmed",
                        feedback: ""
                    },
                    {
                        text: "Call your mom because you feel emotionally lost",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Seeking Support",
                        feedback: ""
                    },
                    {
                        text: "Keep working until exhaustion numbs the pain",
                        next: 'LEARNING_LESSON',
                        score: 10,
                        feedbackTitle: "Numbing",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'LEARNING_LESSON',
                emotion: 'anger',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                text: "LESSON: THE EMPTINESS UNDERNEATH. Justin later said the hardest part of being 19 wasn't the fame — it was realizing he had never learned how to be alone. He had gone from his parents' house to tour buses to hotel rooms. He had never once sat with himself long enough to know who he actually was. The relationship didn't break him. The emptiness underneath did.",
                choices: [
                    { text: "Ponder", next: 'reflection_1', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_1',
                emotion: 'anger',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                text: "Reflection: Can two emotionally broken people heal together, or only damage each other more?",
                choices: [
                    { text: "Next", next: 'reflection_2', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_2',
                emotion: 'anger',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                text: "Reflection: Is missing someone the same as loving them?",
                choices: [
                    { text: "Next", next: 'reflection_3', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'reflection_3',
                emotion: 'anger',
                bg: '/assets/bg-justin-hotel-room-2013.png',
                text: "Reflection: Does fame make loneliness worse or just more visible?",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 18: Virat Kohli (Conversational Story)
    'lvl_age_18_virat': {
        title: "The Hardest Day",
        source: "Source: Virat Kohli, Delhi Ranji Trophy, 2006",
        frames: [
            {
                id: 'intro',
                emotion: 'grief', bg: '/assets/virat_18/1.png', text: " ", choices: [{ text: "Next", next: 'frame_2' }] },
            { id: 'frame_2', bg: '/assets/virat_18/2.png', text: " ", choices: [{ text: "Back", next: 'intro' }, { text: "Next", next: 'frame_3' }] },
            { id: 'frame_3', bg: '/assets/virat_18/3.png', text: " ", choices: [{ text: "Back", next: 'frame_2' }, { text: "Next", next: 'frame_4' }] },
            { id: 'frame_4', bg: '/assets/virat_18/4.png', text: " ", choices: [{ text: "Back", next: 'frame_3' }, { text: "Next", next: 'frame_5' }] },
            { id: 'frame_5', bg: '/assets/virat_18/5.png', text: " ", choices: [{ text: "Back", next: 'frame_4' }, { text: "Next", next: 'frame_6' }] },
            { id: 'frame_6', bg: '/assets/virat_18/6.png', text: " ", choices: [{ text: "Back", next: 'frame_5' }, { text: "Next", next: 'frame_7' }] },
            { 
                id: 'frame_7', 
                bg: '/assets/virat_18/7.png', 
                text: "What would you do?", 
                choices: [
                    { text: "Stay. Your family needs you right now.", next: 'frame_8', score: 5, feedbackTitle: "The Safe Choice", feedback: "Family is everything. Many would choose to stay." }, 
                    { text: "Go. Your father never once asked you to stop.", next: 'frame_8', score: 10, feedbackTitle: "The Driven Choice", feedback: "A difficult, incredible choice. This is what separates the great from the good." }
                ] 
            },
            { id: 'frame_8', bg: '/assets/virat_18/8.png', text: " ", choices: [{ text: "Next", next: 'frame_9' }] },
            { id: 'frame_9', bg: '/assets/virat_18/9.png', text: " ", choices: [{ text: "Back", next: 'frame_8' }, { text: "Next", next: 'frame_10' }] },
            { id: 'frame_10', bg: '/assets/virat_18/10.png', text: " ", choices: [{ text: "Back", next: 'frame_9' }, { text: "Next", next: 'frame_11' }] },
            { id: 'frame_11', bg: '/assets/virat_18/11.png', text: " ", choices: [{ text: "Back", next: 'frame_10' }, { text: "Next", next: 'frame_12' }] },
            { id: 'frame_12', bg: '/assets/virat_18/12.png', text: " ", choices: [{ text: "Back", next: 'frame_11' }, { text: "Next", next: 'frame_13' }] },
            { id: 'frame_13', bg: '/assets/virat_18/13.png', text: " ", choices: [{ text: "Back", next: 'frame_12' }, { text: "Next", next: 'frame_14' }] },
            { id: 'frame_14', bg: '/assets/virat_18/14.png', text: " ", choices: [{ text: "Back", next: 'frame_13' }, { text: "Next", next: 'frame_15' }] },
            { id: 'frame_15', bg: '/assets/virat_18/15.png', text: " ", choices: [{ text: "Back", next: 'frame_14' }, { text: "Next", next: 'frame_16' }] },
            { 
                id: 'frame_16', 
                bg: '/assets/virat_18/16.png', 
                text: "What's your choice?", 
                choices: [
                    { text: "Step away. Some things are bigger than the moment.", next: 'COMPLETE', score: 5, feedbackTitle: "Grief and Reflection", feedback: "Taking time to grieve is a human and understandable path." }, 
                    { text: "Show up anyway. Because that's what they'd want.", next: 'COMPLETE', score: 10, feedbackTitle: "Unbreakable Resolve", feedback: "Virat showed up the next day, saved his team, and attended his father's funeral later that evening. A legend was born." }
                ] 
            }
        ]
    },

    // AGE 20: Kobe Bryant
    'lvl_age_20_kobe': {
        title: "The Lockout Echo",
        source: "Source: 1998-1999 Lockout Season",
        frames: [
            {
                id: 'intro',
                bg: '/assets/kobe-gym-wide.png',
                text: "The 1998 NBA season is shut down, so you organize intense, unofficiated pickup games. After Shaquille O'Neal slaps you across the face for challenging his call, the gym falls into a suffocating silence.",
                choices: [
                    {
                        text: "Walk off the court. Protect your contract.",
                        next: 'consequence_a',
                        score: -5,
                        feedbackTitle: "",
                        feedback: ""
                    },
                    {
                        text: "Force a laugh. De-escalate for team chemistry.",
                        next: 'consequence_b',
                        score: -5,
                        feedbackTitle: "",
                        feedback: ""
                    },
                    {
                        text: "Step directly into his massive frame and throw a punch.",
                        next: 'consequence_c',
                        score: 10,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'consequence_a',
                bg: '/assets/kobe-gym-sunlight.png',
                text: "You spend the season as a clear subordinate. Your fierce internal edge is blunted by backing down.",
                choices: [
                    {
                        text: "Go back and choose again.",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "The Cost of Retreat",
                        feedback: "Wrong because: Retreating signals submission to an alpha. It costs: Your self-respect and the terrifying edge that makes your game work."
                    }
                ]
            },
            {
                id: 'consequence_b',
                bg: '/assets/kobe-shoes-floor.png',
                text: "The game continues, but the psychological hierarchy is cemented. You chose harmony over your own self-respect.",
                choices: [
                    {
                        text: "Go back and choose again.",
                        next: 'intro',
                        score: 0,
                        feedbackTitle: "Hollow Compromise",
                        feedback: "Wrong because: A hollow compromise trades respect for false peace. It costs: You lose your intimidation factor permanently."
                    }
                ]
            },
            {
                id: 'consequence_c',
                bg: '/assets/kobe-lakers-locker.png',
                text: "You throw a flurry of punches before teammates frantically drag you apart. You are isolated from the leader, but you established a terrifying boundary.",
                choices: [
                    {
                        text: "Continue",
                        next: 'lesson_1',
                        score: 10,
                        feedbackTitle: "Establishing Parity",
                        feedback: "Right because: Establishing psychological parity required choosing your boundaries over group comfort."
                    }
                ]
            },
            {
                id: 'lesson_1',
                bg: '/assets/kobe-whiteboard.png',
                text: "LESSON: The Price of Parity\nTrue respect is rarely cleanly negotiated; it is usually extracted through conflict. Establishing boundaries guarantees isolation, but prevents subordination.",
                choices: [
                    {
                        text: "Next Part",
                        next: 'part2_setup',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'part2_setup',
                bg: '/assets/kobe-arena-tunnel.png',
                text: "The lockout ends, but the veterans ambush you in a closed-door meeting to demand you stop shooting so much. You sit entirely alone against a unified front.",
                choices: [
                    {
                        text: "Demand a trade. Escape to a franchise without politics.",
                        next: 'p2_consequence_a',
                        score: -5,
                        feedbackTitle: "",
                        feedback: ""
                    },
                    {
                        text: "Publicly agree. Sacrifice your rhythm to keep the peace.",
                        next: 'p2_consequence_b',
                        score: -5,
                        feedbackTitle: "",
                        feedback: ""
                    },
                    {
                        text: "Absorb their hatred in total silence. Refuse to alter your aggression.",
                        next: 'p2_consequence_c',
                        score: 10,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            {
                id: 'p2_consequence_a',
                bg: '/assets/kobe-office.png',
                text: "The front office refuses to move you, but the rumor leaks to the press. You spend the season viewed as a traitor who runs from adversity.",
                choices: [
                    {
                        text: "Go back and choose again.",
                        next: 'part2_setup',
                        score: 0,
                        feedbackTitle: "Escaping Friction",
                        feedback: "Wrong because: Escaping friction prevents you from learning to dominate from within. It costs: Your reputation and your ability to lead a hostile system."
                    }
                ]
            },
            {
                id: 'p2_consequence_b',
                bg: '/assets/kobe-locker-room.png',
                text: "Your scoring drops, your rhythm vanishes, and the team still loses. You compromised your greatest weapon for dysfunctional harmony.",
                choices: [
                    {
                        text: "Go back and choose again.",
                        next: 'part2_setup',
                        score: 0,
                        feedbackTitle: "Shrinking Your Game",
                        feedback: "Wrong because: Shrinking your game to appease others destroys your unique value. It costs: Your offensive pressure and the team's ultimate success."
                    }
                ]
            },
            {
                id: 'p2_consequence_c',
                bg: '/assets/kobe-basketball.png',
                text: "You step onto the court and play with the exact same ruthless aggression. The tension is suffocating, but they are forced to play off your gravity.",
                choices: [
                    {
                        text: "Continue",
                        next: 'lesson_2',
                        score: 10,
                        feedbackTitle: "Trusting Preparation",
                        feedback: "Right because: Trusting your preparation over their opinions forced them to adapt to your pace."
                    }
                ]
            },
            {
                id: 'lesson_2',
                emotion: 'triumph',
                bg: '/assets/kobe-jersey.png',
                text: "LESSON: The Burden of Conviction\nGroup consensus is often just a collective demand for comfort. If your preparation justifies your actions, you must endure the loneliness of being misunderstood.\n\nHe walked out of that meeting an outcast, armed only with the certainty that his relentless work would force them to conform to his light.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 10,
                        feedbackTitle: "Mission Accomplished",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 22: Michael Jackson
    'lvl_age_22_michael': {
        title: "The Life You Built",
        source: "Source: Van Nuys, California, 1981",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "In 1981, Michael Jackson is 22 and already carrying two different versions of his career. His solo album Off the Wall has made him a major solo artist, while The Jacksons are preparing the Triumph Tour around the album the brothers recorded together. In a Van Nuys rehearsal space, the show has to work for five brothers, but Michael's solo material now occupies a large part of the set. He knows that the tour can strengthen the family group, but every week spent on it is also time away from developing what he has started on his own. The rehearsal stops, the room waits, and Michael has to decide how much of himself this next chapter belongs to the family.",
                choices: [
                    {
                        text: "A) Commit fully to the tour and let the next solo project wait until the shows are finished.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Two Careers, One Life",
                        feedback: "You value commitment over momentum. It protects the family project, but your own work has to wait for space that may become harder to find."
                    },
                    {
                        text: "B) Stay involved with the brothers but reduce his role wherever the group can function without him.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Two Careers, One Life",
                        feedback: "You protect your independence through distance. It gives you more room, but the people beside you may experience that distance as withdrawal."
                    },
                    {
                        text: "C) Treat the tour as a serious part of his own development and use it to build the kind of live show he wants for himself later.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Two Careers, One Life",
                        feedback: "You treat the current obligation as part of your future rather than an interruption. It may cost time, but it lets you learn from a stage you already have."
                    },
                    {
                        text: "D) Ask his brothers to agree on a shorter commitment, even if that means reopening a decision everyone thought had already been made.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Two Careers, One Life",
                        feedback: "You believe the arrangement should be renegotiated before the cost becomes larger. It gives everyone a clearer choice, but it risks reopening tensions that were already settled."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'determination',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "What Michael actually did:\nMichael committed to The Jacksons and the Triumph Tour. He remained deeply involved in the performances and helped shape the show's choreography, costumes and stage presentation while continuing to develop his solo direction.\n\nLESSON: Two Careers, One Life\nA choice can be meaningful without being permanent. Michael did not need to decide between his family and his solo career in one dramatic moment; he could give the family project everything he had while quietly learning what he would eventually need for himself. The difficult part was accepting that time given to one path could not also be spent building the other.",
                choices: [
                    { text: "Next Chapter", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'triumph',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "Weeks of rehearsal turn the tour into something larger than a set of songs. Michael begins shaping the presentation with new costumes, choreography and stage ideas, drawing on the scale and precision he wants from a live performance. The set now places his solo songs beside the brothers' material, making the difference between the two parts of his career impossible to ignore. On the first night in Memphis, the audience responds to both, and the pressure of being the person expected to carry the show becomes real. After the performance, Michael has to decide what to take from this experience when the tour eventually ends.",
                choices: [
                    {
                        text: "A) Keep the strongest ideas from the tour private until he has a solo project where he can control the entire presentation.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Learn Before Leaving",
                        feedback: "You protect unfinished ideas by keeping them away from immediate expectations. That preserves control, but it also delays learning what those ideas can become in public."
                    },
                    {
                        text: "B) Return to the studio immediately and build the next solo record around what the audience responded to tonight.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Learn Before Leaving",
                        feedback: "You trust momentum and want to turn the audience's response into new work quickly. It can produce clarity, but speed can also make the next project inherit the last one's assumptions."
                    },
                    {
                        text: "C) Spend more time refining the live show before moving on, even if the next record takes longer to begin.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Learn Before Leaving",
                        feedback: "You believe mastery comes from repetition before expansion. It deepens the craft, but the next opportunity may arrive before you feel completely ready."
                    },
                    {
                        text: "D) Treat the tour as finished work and start from a completely different creative direction rather than repeating what already worked.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Learn Before Leaving",
                        feedback: "You value reinvention over continuation. It prevents you from becoming dependent on one formula, but it can discard useful lessons along with the old approach."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'triumph',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "What Michael actually did:\nMichael completed the Triumph Tour with his brothers, performing both Jacksons material and songs from Off the Wall. After the tour ended, he returned to the studio and began the work that would become his next solo album, Thriller.\n\nLESSON: Learn Before Leaving\nLeaving something behind does not require rejecting everything it taught you. Michael's next step was not a clean break from the experience with his brothers; the discipline, staging and scale he developed there became part of the foundation for what came next. Sometimes the useful question is not whether to stay or leave, but what you are willing to carry forward.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Ashneer Grover
    'lvl_age_22_ashneer': {
        title: "The Next Degree",
        source: "Source: Ahmedabad, India, 2004",
        frames: [
            {
                id: 'intro',
                emotion: 'mystery',
                bg: '/assets/bg-ashneer-grover-ahmedabad-2004.png',
                portrait: '/assets/portrait-ashneer-grover.png',
                text: "It is 2004, and Ashneer Grover has just completed his B.Tech in Civil Engineering at IIT Delhi. He has already taken an unusual path once: during IIT, he was one of only six students selected from his batch for an exchange at INSA Lyon in France, supported by a French Embassy scholarship. Now another door is open — IIM Ahmedabad, where he has entered an MBA program in Finance. Engineering has given him a technical foundation, but finance is an entirely different world, and he has no guarantee of where it will lead. He has to commit to the next two years before knowing what kind of career he is actually building.",
                choices: [
                    {
                        text: "A) Commit fully to the MBA in Finance and treat the next two years as a chance to build an entirely different professional skill set.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Don't Overprotect Your Past",
                        feedback: "You are willing to become a beginner again even after succeeding in one field. That creates discomfort now, but gives you a second professional language."
                    },
                    {
                        text: "B) Stay closest to engineering and look for a path where his IIT training remains the center of his career.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Don't Overprotect Your Past",
                        feedback: "You value depth and continuity over reinvention. It can make you exceptionally strong in one domain, but may close doors before you discover them."
                    },
                    {
                        text: "C) Use the MBA mainly as a gateway into business, keeping his options open rather than deciding what he ultimately wants to become.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Don't Overprotect Your Past",
                        feedback: "You want optionality more than certainty. You keep several futures alive, but must eventually accept that options only matter when you commit to one."
                    },
                    {
                        text: "D) Step back from the expected academic path and spend time figuring out what kind of work he actually wants before committing further.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Don't Overprotect Your Past",
                        feedback: "You refuse to let prestige make the decision for you. The freedom is valuable, but stepping away also means giving up momentum that others would consider difficult to regain."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'mystery',
                bg: '/assets/bg-ashneer-grover-ahmedabad-2004.png',
                portrait: '/assets/portrait-ashneer-grover.png',
                text: "What they actually did:\nGrover went ahead with the MBA in Finance at IIM Ahmedabad, beginning the 2004–2006 chapter that would eventually lead to his first major corporate role after graduation.\n\nLESSON: Don't Overprotect Your Past\nAn engineering degree can become an identity if you let it. Grover's move into finance did not erase what IIT had taught him; it added another way of understanding how businesses work. Sometimes the useful decision is not choosing between your old skill and a new direction, but deliberately becoming someone who can use both.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'determination',
                bg: '/assets/bg-ashneer-grover-ahmedabad-2004.png',
                portrait: '/assets/portrait-ashneer-grover.png',
                text: "At IIM Ahmedabad, Grover is now moving from the structured world of engineering into finance, management, and business. His IIT background gives him analytical training, while the MBA forces him to think about companies, capital, and commercial decisions in a different way. The destination is still unclear, but the combination itself is becoming his advantage. The question is no longer whether he can succeed academically — it is what he intends to do with that combination when the degree ends.",
                choices: [
                    {
                        text: "A) Aim for the strongest finance role available after the MBA, even if it means entering a highly structured corporate career.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Build the Combination",
                        feedback: "You prioritize security, reputation, and a clear professional ladder. That can compound quickly, but it may pull you toward optimizing a career rather than designing one."
                    },
                    {
                        text: "B) Look for a role where finance and business-building overlap, even if the path is less predictable.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Build the Combination",
                        feedback: "You are attracted to the intersection between analysis and creation. The path may be less obvious, but the combination can become more valuable than either skill alone."
                    },
                    {
                        text: "C) Choose the opportunity that offers the steepest learning curve, regardless of whether the job title looks impressive.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Build the Combination",
                        feedback: "You measure opportunities by what they teach rather than what they signal. That can produce unconventional experience, but requires patience when others are optimizing for status."
                    },
                    {
                        text: "D) Keep pursuing credentials and high-signal institutions until the direction becomes clearer.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Build the Combination",
                        feedback: "You believe more credentials will eventually reveal the right answer. Sometimes they do; sometimes they simply postpone the harder work of choosing."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'mystery',
                bg: '/assets/bg-ashneer-grover-ahmedabad-2004.png',
                portrait: '/assets/portrait-ashneer-grover.png',
                text: "What they actually did:\nGrover completed the MBA in Finance in 2006 and entered investment banking through campus recruitment, joining Kotak Investment Banking as a Vice President.\n\nLESSON: Build the Combination\nThe important advantage was not IIT by itself or IIM by itself. It was the combination of technical training and financial thinking that later gave Grover a broader toolkit for business decisions. A career can become powerful when seemingly unrelated skills begin reinforcing each other.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Bhuvan Bam
    'lvl_age_22_bhuvan': {
        title: "When the Phone Started Working",
        source: "Source: BB Ki Vines & TEDxIIITD, 2016",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/bg-bhuvan-bam-delhi-2016.png',
                portrait: '/assets/portrait-bhuvan-bam.png',
                text: "It is 2016, and Bhuvan Bam is 22, living in Delhi after graduating from Shaheed Bhagat Singh College with a degree in History. Music is not a side hobby for him; before BB Ki Vines became huge, singing and composing had been an important part of his life and income, including live performances. But his YouTube experiment has changed quickly. BB Ki Vines, launched in June 2015, has grown to more than a million subscribers within months, while his short Hindi comedy videos have found an audience far larger than he expected. He is still shooting and editing largely by himself, from a small room, using the same basic setup that got him there — but suddenly the internet is treating this as a real career.",
                choices: [
                    {
                        text: "A) Keep YouTube as the main creative priority and continue making the videos yourself, even if that means turning down some opportunities that could accelerate the career.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Momentum Is Not A Plan",
                        feedback: "You protect the creative process that produced the audience, even if it means turning down faster growth. You are betting that authenticity is more valuable than scale."
                    },
                    {
                        text: "B) Put more energy into live music and performances, using the new online audience to strengthen the career you already know how to sustain.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Momentum Is Not A Plan",
                        feedback: "You trust the skill that existed before the internet noticed you. You are not rejecting the new audience; you are refusing to let it erase the craft that came first."
                    },
                    {
                        text: "C) Start treating the channel as a professional entertainment career: accept outside opportunities, collaborations and larger productions even if the work becomes less personal.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Momentum Is Not A Plan",
                        feedback: "You believe an opportunity becomes real only when you build something bigger around it. You accept that professionalizing the work may also change the work."
                    },
                    {
                        text: "D) Keep both paths running for now, accepting that splitting your attention may slow the growth of either one while you figure out which audience is actually durable.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Momentum Is Not A Plan",
                        feedback: "You refuse to make a permanent decision from a temporary surge. You preserve optionality, but the cost is divided attention at exactly the moment momentum is hardest to replace."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'tension',
                bg: '/assets/bg-bhuvan-bam-delhi-2016.png',
                portrait: '/assets/portrait-bhuvan-bam.png',
                text: "What Bhuvan actually did:\nBam continued building BB Ki Vines while retaining music as an important part of his identity. He kept the low-tech, one-person creative process that had become part of his identity, while his audience and professional opportunities expanded rapidly. By the end of 2016, he had crossed one million subscribers and had been recognized at the WebTVAsia Awards.\n\nLESSON: Momentum Is Not A Plan\nSudden attention creates a strange problem: everyone around you starts behaving as though the future is already decided. But an audience is evidence that something is working, not proof that you know what to build next. The difficult part is deciding how much of the thing that made people notice you should change once people start watching.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'hope',
                bg: '/assets/bg-bhuvan-bam-delhi-2016.png',
                portrait: '/assets/portrait-bhuvan-bam.png',
                text: "The experiment is no longer invisible. Bam is appearing outside his own channel, including in TVF's Bachelors, while invitations to speak and collaborate are beginning to arrive. In June 2016, he spoke at TEDxIIITD about originality and pursuing his dreams, and later that year his rapidly growing channel received major recognition at the WebTVAsia Awards in Seoul. The opportunities are beginning to move him from a creator working alone into a person other people want to build projects around. Now the harder question is not whether people are watching. It is how much of the new machine he should allow into his creative life.",
                choices: [
                    {
                        text: "A) Take the strongest outside opportunities one at a time, but keep BB Ki Vines as the place where you retain complete creative control.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Protect What Made You Different",
                        feedback: "You separate experimentation from ownership. You are willing to explore outside opportunities as long as one place remains completely yours."
                    },
                    {
                        text: "B) Say yes to bigger collaborations and professional projects while the attention is available, even if the schedule leaves less room for the small videos that built the audience.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Protect What Made You Different",
                        feedback: "You understand that attention has a shelf life. You would rather risk creative exhaustion than discover later that you let a rare window of opportunity close."
                    },
                    {
                        text: "C) Protect the channel above everything else and postpone larger opportunities until you know exactly what you want the Bhuvan Bam identity to become.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Protect What Made You Different",
                        feedback: "You value identity over expansion. The risk is that protecting the original formula too carefully can become its own kind of limitation."
                    },
                    {
                        text: "D) Build a small professional structure around yourself now, even though delegating work means accepting that the channel will no longer be entirely yours in the way it was at the beginning.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Protect What Made You Different",
                        feedback: "You recognize that scale eventually requires systems. You are willing to give up some control now in exchange for having the capacity to build something larger later."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'tension',
                bg: '/assets/bg-bhuvan-bam-delhi-2016.png',
                portrait: '/assets/portrait-bhuvan-bam.png',
                text: "What Bhuvan actually did:\nBam continued expanding beyond the original BB Ki Vines format. In 2016 he collaborated with The Viral Fever on Bachelors and continued pursuing other opportunities while maintaining the distinctive BB Ki Vines style. By the end of the year, he described the period as a roller-coaster and said that having an audience in the millions felt like an artist's dream, while also emphasizing that it was only the beginning.\n\nLESSON: Protect What Made You Different\nGrowth creates a new kind of pressure: once something works, other people naturally want to optimize it. The danger is not necessarily accepting help or taking bigger opportunities. It is losing the unusual process that made people care before anyone knew how valuable it was.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Cristiano Ronaldo
    'lvl_age_22_ronaldo': {
        title: "The Price of Becoming Complete",
        source: "Source: Manchester United Season Review, 2007",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "It is April 2007, and Cristiano Ronaldo is 22, entering the most important stage of his development at Manchester United. The boy who arrived from Sporting CP as an exciting teenager has become a central player in Sir Alex Ferguson's side, but the expectations have changed with him. He has scored twice against Roma in the Champions League quarter-final as United win 7–1, helping them reach the semi-finals, while he is also being recognized as one of the best young players in England. But the next challenge is different: against AC Milan, talent alone will not guarantee that he controls the game. He now has to decide how much of his instinctive, expressive style should remain when every mistake is being judged at the highest level.",
                choices: [
                    {
                        text: "A) Keep playing with the same freedom. The unpredictability is part of what makes you dangerous, and changing too much could remove the qualities that got you here.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Talent Needs Structure",
                        feedback: "You protect the instinct that makes your game distinctive. The upside is unpredictability; the cost is that opponents and teammates may know less about what they can expect from you."
                    },
                    {
                        text: "B) Simplify your game when necessary. Take fewer risks, stay more involved defensively, and prioritize what the team needs even if fewer moments belong to you.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Talent Needs Structure",
                        feedback: "You prioritize reliability over expression. You become more useful to the team, but risk suppressing the individual quality that separates you from everyone else."
                    },
                    {
                        text: "C) Become more deliberate about when you take risks. Keep the dribbling and creativity, but start choosing the moments instead of treating every possession as an opportunity to attack.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Talent Needs Structure",
                        feedback: "You are willing to change without abandoning yourself. The cost is that deliberate decision-making can feel slower than instinct, especially when confidence is high."
                    },
                    {
                        text: "D) Put the pressure aside completely and focus only on producing the next performance. Let Ferguson decide what needs changing and concentrate on executing it.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Talent Needs Structure",
                        feedback: "You trust the structure around you instead of constantly self-correcting. That can accelerate development, but it also means accepting that someone else is defining parts of your evolution."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'tension',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "What Cristiano actually did:\nRonaldo continued developing rather than abandoning his individual qualities. He remained an attacking threat while becoming increasingly productive and tactically important for United. Against Milan in the semi-final first leg, he scored early, but United lost the second leg 3–0 at San Siro and were eliminated.\n\nLESSON: Talent Needs Structure\nAt the highest level, being capable of something is not the same as knowing when to use it. Ronaldo's evolution was not about removing the flair that made him special; it was about making that flair serve a larger understanding of the game.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'triumph',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "By May, the season has become a strange mixture of success and unfinished business. Manchester United have won the Premier League, and Ronaldo has scored the only goal in the Manchester derby that effectively seals the title. He has also won the PFA Players' Player of the Year, PFA Young Player of the Year, PFA Fans' Player of the Year and the Football Writers' Footballer of the Year awards. Yet the FA Cup final against Chelsea is still ahead, and United's Champions League exit has shown that individual brilliance cannot guarantee the biggest prizes. At 22, he is receiving more recognition than ever while also having more expectations placed on him than ever.",
                choices: [
                    {
                        text: "A) Chase the individual numbers even harder. If you are becoming one of the world's best players, the clearest proof is what appears beside your name.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "The Standard Moves",
                        feedback: "You measure progress through numbers because numbers give you something concrete to control. The danger is optimizing your performance rather than the team's outcome."
                    },
                    {
                        text: "B) Shift your priority toward winning major matches, even if that sometimes means fewer goals, fewer touches, or less personal attention.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "The Standard Moves",
                        feedback: "You want your ability to translate into winning rather than recognition. The trade-off is accepting that some of your best work may never appear in the statistics."
                    },
                    {
                        text: "C) Treat the rest of the season as part of a longer development plan. Accept that becoming complete may take another year even if people already expect the finished player.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "The Standard Moves",
                        feedback: "You are willing to disappoint people who expect immediate perfection in exchange for building something sustainable. That requires confidence without certainty."
                    },
                    {
                        text: "D) Use the growing recognition to demand a larger role and greater influence within the team, accepting the possibility that pushing for more responsibility creates friction.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "The Standard Moves",
                        feedback: "You believe greater responsibility should accompany greater ability. The reward is influence; the risk is discovering that leadership creates expectations that talent alone cannot satisfy."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'tension',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "What Cristiano actually did:\nRonaldo continued to grow into a more complete and influential player rather than choosing between individual success and team success. United won the Premier League, although Chelsea beat them 1–0 in the FA Cup final. His performances across the season earned him all four major PFA/FWA individual honours.\n\nLESSON: The Standard Moves\nSuccess does not remove pressure; it changes who applies it. Once you prove that you can perform, people stop asking whether you are good enough and start asking whether you can do it every week, in every competition, against every opponent.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Ranveer Singh
    'lvl_age_22_ranveer': {
        title: "The Role You Can't See Yet",
        source: "Source: Mumbai, Maharashtra, 2007-2008",
        frames: [
            {
                id: 'intro',
                emotion: 'mystery',
                bg: '/assets/bg-ranveer-singh-mumbai-2007.png',
                portrait: '/assets/portrait-ranveer-singh.png',
                text: "You are 22, back in Mumbai after studying in the United States.\n\nYou know you want a creative life, and acting has become more than just an old childhood fantasy. You have taken acting classes and explored theatre, but the reality of breaking into Hindi cinema is very different from performing in college.\n\nThere is no guaranteed film waiting for you. You need to establish yourself professionally while figuring out whether acting can actually become your career.\n\nAdvertising offers a legitimate creative path, while acting remains uncertain and difficult to enter.\n\nThe question is not whether you have a dream. The question is what you are willing to do while the dream has no proof yet.",
                choices: [
                    {
                        text: "A) Take the advertising route seriously. Build professional experience and financial stability while continuing to develop creatively on the side.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "A Dream Needs a Runway",
                        feedback: "You prioritize stability and skill-building. You are willing to let your ambition develop gradually rather than demanding immediate proof."
                    },
                    {
                        text: "B) Push aggressively toward acting immediately. Spend your time approaching people in the film industry, building a portfolio and looking for auditions, even without knowing when an opportunity will arrive.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "A Dream Needs a Runway",
                        feedback: "You prioritize direct pursuit over security. You accept uncertainty because getting closer to the goal matters more than having a predictable professional path."
                    },
                    {
                        text: "C) Look for a hybrid path. Take creative industry work that can provide exposure to filmmaking while continuing to pursue acting.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "A Dream Needs a Runway",
                        feedback: "You value optionality. You want proximity to the creative world without betting everything on an outcome you cannot yet control."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'mystery',
                bg: '/assets/bg-ranveer-singh-mumbai-2007.png',
                portrait: '/assets/portrait-ranveer-singh.png',
                text: "What Ranveer actually did:\nRanveer returned to Mumbai in 2007 and worked in advertising as a copywriter, including work associated with agencies such as O&M and J. Walter Thompson. He continued moving toward the film industry rather than abandoning acting altogether.\n\nLESSON: A Dream Needs a Runway\nAt 22, the important decision was not simply “dream or no dream.” A practical career could provide experience and stability while the larger ambition remained uncertain. Ranveer's early path shows that pursuing a creative ambition does not always begin with the glamorous version of that career.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'determination',
                bg: '/assets/bg-ranveer-singh-mumbai-2007.png',
                portrait: '/assets/portrait-ranveer-singh.png',
                text: "Your advertising experience has given you a foothold in the creative industry, but being close to filmmaking is beginning to matter more.\n\nAn assistant-director opportunity provides another way into the film world. It is not the same as being an actor, but it offers something advertising cannot: proximity to actual film production and the people who make movies.\n\nYet choosing this path means accepting that you are still not getting what you ultimately want.\n\nYou could remain in a more established professional environment, use filmmaking experience as a stepping stone, or commit yourself more directly to acting despite the uncertainty.",
                choices: [
                    {
                        text: "A) Stay in advertising and continue developing your career there while pursuing acting when opportunities appear.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Proximity Is Not the Destination",
                        feedback: "You protect your existing professional foundation. You prefer controlled risk and believe the dream can be pursued without abandoning stability."
                    },
                    {
                        text: "B) Move into assistant-director work. Learn filmmaking from inside the industry, build relationships and accept that acting may have to wait.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Proximity Is Not the Destination",
                        feedback: "You value proximity and learning. You are willing to temporarily accept a different role because being inside the filmmaking environment may teach you things that cannot be learned from outside."
                    },
                    {
                        text: "C) Treat assistant-director work only as a temporary bridge and leave as soon as possible to pursue acting directly.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Proximity Is Not the Destination",
                        feedback: "You prioritize the destination over the stepping stone. You are willing to sacrifice certainty because you believe divided attention may keep you from seriously pursuing acting."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'tension',
                bg: '/assets/bg-ranveer-singh-mumbai-2007.png',
                portrait: '/assets/portrait-ranveer-singh.png',
                text: "What Ranveer actually did:\nRanveer did work as an assistant director after his advertising experience, but ultimately left that route to pursue acting seriously. He then began approaching directors with his portfolio and attending auditions. His breakthrough would still take several years; Yash Raj Films eventually selected him for Band Baaja Baaraat in 2010.\n\nLESSON: Proximity Is Not the Destination\nGetting closer to the industry is not automatically the same as getting closer to the career you actually want. A stepping-stone role can teach you, connect you and open doors—but eventually you have to decide whether the stepping stone is becoming a destination.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Alia Bhatt
    'lvl_age_22_alia': {
        title: "More Than a Star",
        source: "Source: Mumbai, Maharashtra, 2015",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg-alia-bhatt-mumbai-2015.png',
                portrait: '/assets/portrait-alia-bhatt.png',
                text: "You are 22 and already four films into your career.\n\nPeople are beginning to describe you as one of Bollywood's promising young actors. But internally, you don't see yourself as having “made it.” You know four films are not a lifetime of work.\n\nYour next film, Shaandaar, is a large commercial project. It could strengthen your position and broaden your audience—but it also means more expectations.\n\nThe question is no longer simply whether you can get work. What kind of actor do you want your next choices to make you?",
                choices: [
                    {
                        text: "A) Choose another safe, commercially appealing role and strengthen your position with the audience.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Success Creates a New Problem",
                        feedback: "You value momentum and audience connection over experimentation."
                    },
                    {
                        text: "B) Prioritize challenging characters, even if they carry greater professional risk.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Success Creates a New Problem",
                        feedback: "You prioritize artistic growth even when the safer career path may be easier."
                    },
                    {
                        text: "C) Balance both: take commercially accessible projects while deliberately searching for more demanding roles.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Success Creates a New Problem",
                        feedback: "You believe ambition does not require choosing between commercial success and creative development immediately."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'determination',
                bg: '/assets/bg-alia-bhatt-mumbai-2015.png',
                portrait: '/assets/portrait-alia-bhatt.png',
                text: "What Alia actually did:\nAlia continued with Shaandaar, while increasingly seeking roles that allowed her to demonstrate different sides of her acting. She described the film as commercially important while also emphasizing the value of building her career and brand.\n\nLESSON: Success Creates a New Problem\nGetting opportunities is only the first challenge. Once opportunities arrive consistently, the harder question becomes what you want those opportunities to build.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'wonder',
                bg: '/assets/bg-alia-bhatt-mumbai-2015.png',
                portrait: '/assets/portrait-alia-bhatt.png',
                text: "You have established yourself unusually quickly.\n\nBut being known for a certain kind of performance can become its own limitation. If audiences already have an image of you, changing that image requires deliberately stepping outside it.\n\nYou could continue giving audiences versions of what they already like—or use your growing credibility to experiment.\n\nThe safer path protects what you have built. The riskier path could change how people see you.",
                choices: [
                    {
                        text: "A) Continue strengthening the persona audiences already respond to.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Don't Let Early Success Define the Ceiling",
                        feedback: "You prioritize consistency and protecting the audience relationship you've already built."
                    },
                    {
                        text: "B) Actively pursue dramatically different characters, even if audiences are surprised by the change.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Don't Let Early Success Define the Ceiling",
                        feedback: "You prioritize exploration and are willing to make your audience reconsider what they expect from you."
                    },
                    {
                        text: "C) Wait until you have more experience before making a major shift in your image.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Don't Let Early Success Define the Ceiling",
                        feedback: "You value patience and believe experimentation becomes more powerful after establishing a stronger foundation."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'wonder',
                bg: '/assets/bg-alia-bhatt-mumbai-2015.png',
                portrait: '/assets/portrait-alia-bhatt.png',
                text: "What Alia actually did:\nAlia increasingly moved toward varied and demanding performances. The following year, she took roles in Udta Punjab and Dear Zindagi, demonstrating a significant expansion beyond her earlier image.\n\nLESSON: Don't Let Early Success Define the Ceiling\nEarly success gives you leverage, but it can also create expectations. Growth sometimes means deliberately using that success to make yourself harder to categorize.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Bhagat Singh
    'lvl_age_22_bhagat': {
        title: "The Price of a Voice",
        source: "Source: Lahore, British India, 1929-1930",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "You are 22 and have already spent months in prison.\n\nThe hunger strike began as a demand for better treatment of political prisoners. But now the situation has become far more serious.\n\nJatin Das has died after 63 days on hunger strike. Public anger is growing, but inside the jail the remaining prisoners are physically weakened.\n\nYou now have to decide whether continuing the protest is worth the personal cost when someone has already paid the ultimate price.",
                choices: [
                    {
                        text: "A) End the hunger strike now. The death of Jatin Das has already exposed the prison conditions; continuing may only create more deaths.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Conviction Has a Cost",
                        feedback: "You prioritize preserving life and recognize when a protest has already achieved significant visibility."
                    },
                    {
                        text: "B) Continue the hunger strike. Ending now could mean surrendering the pressure that has been created.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Conviction Has a Cost",
                        feedback: "You believe sustained sacrifice is necessary when authorities have not meaningfully addressed the underlying injustice."
                    },
                    {
                        text: "C) Pause the hunger strike and redirect the protest toward written statements, legal proceedings and public advocacy.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Conviction Has a Cost",
                        feedback: "You value changing tactics rather than allowing one method of resistance to consume everything else."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'grief',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "What Bhagat Singh actually did:\nBhagat Singh continued the hunger strike despite Jatin Das's death. The strike ultimately lasted 116 days and ended on 5 October 1929.\n\nLESSON: Conviction Has a Cost\nA principle becomes much harder to defend when defending it begins to cost you personally. Conviction is not simply believing strongly—it is deciding what cost you are prepared to accept.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'anger',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "The Lahore Conspiracy Case is moving forward.\n\nYou are facing a colonial tribunal whose authority you do not recognize. Yet the courtroom gives you something valuable: an audience.\n\nYou can participate in proceedings and use them to present your arguments, or refuse to cooperate when you believe the process itself is being used against you.\n\nEvery decision carries a cost. Participation can give you a platform. Refusal can become a protest in itself.",
                choices: [
                    {
                        text: "A) Fully participate in the proceedings and use the courtroom as a platform to explain your political position.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "A Platform Can Become a Battlefield",
                        feedback: "You believe influence comes from staying inside the system and using its visibility against it."
                    },
                    {
                        text: "B) Refuse to participate when the court restricts your ability to defend yourself and challenge the proceedings.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "A Platform Can Become a Battlefield",
                        feedback: "You believe refusing legitimacy can communicate more powerfully than participating."
                    },
                    {
                        text: "C) Continue participating selectively—use the courtroom when it serves your political purpose but refuse proceedings you consider unjust.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "A Platform Can Become a Battlefield",
                        feedback: "You prioritize tactical flexibility, choosing engagement based on whether it advances your larger objective."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'anger',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "What Bhagat Singh actually did:\nBhagat Singh and his comrades repeatedly challenged the proceedings. In January 1930, Bhagat Singh explained their refusal to attend court, citing restrictions on their defence and treatment of prisoners. Later, an “undefended accused” statement declared that they did not recognize the colonial government or the tribunal.\n\nLESSON: A Platform Can Become a Battlefield\nWhen you cannot control the institution you are facing, you can still decide how you engage with it. Participation, refusal and selective engagement can each become forms of strategy.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 22: Rani Lakshmibai
    'lvl_age_22_rani_lakshmibai': {
        title: "The Silent Palace",
        source: "Source: Jhansi, India, 1851",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "You are 22 years old, the Queen of a prosperous, independent kingdom. For years, your court has lived in a state of quiet anxiety, knowing that the foreign East India Company is swallowing up neighboring states that fail to produce a male heir. A few months ago, the kingdom exhaled in massive celebration when you finally gave birth to a son. The future was secure.\n\nBut today, the palace is entirely silent.\n\nYour four-month-old infant son has just fallen fatally ill and died. Your husband, the Maharaja, is shattered by the loss and has withdrawn into his quarters, inconsolable. You are a young mother who has just suffered the most profound personal loss imaginable — but already, you can feel the political vultures circling your childless throne.",
                choices: [
                    {
                        text: "A) Retreat into mourning, stepping away from all court duties to fully process your devastating personal loss, leaving the state's administration to the ministers.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Vulnerable",
                        feedback: "You prioritize human emotional needs and mental health, believing that attempting to function through acute trauma is unsustainable."
                    },
                    {
                        text: "B) Immediately push the court to adopt a new heir from the extended royal family to instantly secure the kingdom's political future before the British can react.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Pragmatic",
                        feedback: "You are hyper-focused on survival and strategy, able to instantly compartmentalize personal tragedy to solve an immediate, existential threat."
                    },
                    {
                        text: "C) Suppress your own grief to publicly project strength, focusing entirely on holding the court together and supporting your deeply depressed husband.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Dutiful",
                        feedback: "You possess immense internal fortitude, willing to delay your own healing to serve as the anchor for the people who depend on you."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'grief',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "What Lakshmibai actually did:\nDespite her overwhelming grief as a young mother, she recognized that Jhansi was in a highly precarious position. With the Maharaja completely broken by the tragedy, she bore her sorrow with immense stoicism. She stepped up to maintain the stability of the court, projecting strength to prevent internal panic and external opportunism — prioritizing her husband's fragile state and the kingdom's immediate stability over her own mourning.\n\nLESSON: The Mask of Strength\nIn positions of immense responsibility, personal grief is often politically weaponized by enemies, forcing leaders to process their pain behind a mask of strength.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'tension',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "Months have passed since your infant's death. The grief has permanently broken your husband's health — the Maharaja is becoming increasingly weak and bedridden.\n\nThe political reality is now terrifyingly clear: the British East India Company has recently established a policy allowing them to annex any Indian state that lacks a \"natural\" heir. You are only 22, yet the survival of an entire kingdom is suddenly resting on your young shoulders.\n\nThe court ministers are whispering — some are loyal, but others are quietly calculating whether to side with the British for their own gain. With the King incapacitated, you must decide how to handle the impending crisis of succession before the kingdom is stolen from you.",
                choices: [
                    {
                        text: "A) Secretly open diplomatic channels with the British to negotiate a treaty that protects your royal status and wealth, even if it means conceding some of the kingdom's independence.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Compromising",
                        feedback: "You favor negotiation and self-preservation, preferring to lose some power on your own terms rather than risk losing everything in a forced takeover."
                    },
                    {
                        text: "B) Begin quietly consolidating power, building a fiercely loyal faction among the military and court ministers so that you hold absolute control if the King passes.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Authoritative",
                        feedback: "You believe true security comes from hard power and loyalty, trusting in your ability to command people rather than relying on legal technicalities."
                    },
                    {
                        text: "C) Focus solely on navigating Hindu law and British legal frameworks to find a legitimate relative to adopt, racing against the King's failing health to make it official.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Strategic",
                        feedback: "You are highly analytical, recognizing that defeating a larger system requires using its own rules, laws, and procedures against it."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'tension',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "What Lakshmibai actually did:\nHer primary, desperate focus became finding a legitimate relative from the extended royal family to adopt (who would become Anand Rao, later renamed Damodar Rao). She had to ensure this was done exactly according to tradition and legal precedent so the British could not invalidate it. She spent this critical period racing against time to get her dying husband to officially sign the adoption papers in the presence of British officers — attempting to trap the Company within their own legal bureaucracy.\n\nLESSON: Use Their Rules Against Them\nWhen facing an overwhelmingly powerful institution, survival often depends on mastering their legal loopholes rather than relying on immediate confrontation.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 11: Virat Kohli
    'lvl_age_11_virat_kohli': {
        title: "The Extra Hour",
        source: "Source: West Delhi Cricket Academy, Paschim Vihar, New Delhi (1999–2000)",
        frames: [
            {
                id: 'intro',
                emotion: 'determination',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "You are 11 years old in New Delhi, training at the West Delhi Cricket Academy in Paschim Vihar under coach Raj Kumar Sharma. You naturally enjoy attacking strokes and trust your instinct, but your coach keeps correcting your technique and shot selection. The stroke you naturally want to play is not always the stroke your coach wants you to play. With another session ahead, you must decide how much you trust instinct and how much you trust technical correction.",
                choices: [
                    {
                        text: "A) Keep playing the shot naturally: Trust your instinct and continue using the stroke that feels strongest to you.",
                        next: 'part1_reveal',
                        score: 5,
                        feedbackTitle: "Instinct",
                        feedback: "You trust your natural ability and prefer learning through experimentation."
                    },
                    {
                        text: "B) Follow the technical correction completely: Temporarily suppress your preferred stroke and concentrate on rebuilding the movement exactly as your coach teaches it.",
                        next: 'part1_reveal',
                        score: 15,
                        feedbackTitle: "Discipline",
                        feedback: "You are willing to sacrifice what feels comfortable in order to build stronger fundamentals."
                    },
                    {
                        text: "C) Find a middle ground: Keep your attacking stroke as part of your game, but deliberately practise the corrected movement first and use the attacking shot only when the delivery justifies it.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Adaptability",
                        feedback: "You preserve your natural strengths while accepting structured correction."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'determination',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "What actually happened:\nHistorical accounts describe Raj Kumar Sharma correcting Kohli's shot selection and technique during his academy development. Sharma specifically recalled working on Kohli's tendency to play certain strokes and using repeated throw-down practice to improve his technique. The historical record does NOT establish that Kohli faced these exact three choices on one particular day at age 11. The historically supported pattern is that Kohli's natural ability was being shaped through deliberate technical coaching and repetition.\n\nLESSON: Technique Determines Consistency\nNatural ability can show you what you are capable of. Technique determines how consistently you can use it. At this stage, the important decision was not whether to abandon instinct, but whether instinct could survive disciplined training.",
                choices: [
                    { text: "Next Part", next: 'part2_setup', score: 0, feedbackTitle: "", feedback: "" }
                ]
            },
            {
                id: 'part2_setup',
                emotion: 'determination',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "The practice session is continuing. Other young players have already finished their turns, and you have already been batting for a long time. Your coach tells you that your round is finished, but you still want another round. You are tired, but another round gives you more opportunities to practise. There is no guarantee that extra practice will lead anywhere — there is only today's session. What do you do?",
                choices: [
                    {
                        text: "A) Stop when your coach tells you to: Respect the structure of the session and conserve your energy for the next day.",
                        next: 'part2_reveal',
                        score: 5,
                        feedbackTitle: "Balance",
                        feedback: "You value consistency and understand that development also requires knowing when to stop."
                    },
                    {
                        text: "B) Ask for one more serious round: Stay at the nets and use the extra time specifically to work on your weaknesses.",
                        next: 'part2_reveal',
                        score: 15,
                        feedbackTitle: "Persistence",
                        feedback: "You are willing to put in additional effort when you believe the opportunity is worth it."
                    },
                    {
                        text: "C) Stop batting but stay and observe: Watch the other players and learn by studying their technique instead of continuing to bat yourself.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Observation",
                        feedback: "You look for learning opportunities even when you are not actively performing."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'determination',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "What actually happened:\nRaj Kumar Sharma later recalled that Kohli routinely wanted to bat considerably longer than other young players at the academy. According to Sharma's recollection, while other children generally batted for around 15–20 minutes, Kohli could continue for roughly 45 minutes and would ask for another round even after being told his turn was finished. This is NOT presented as a verbatim recreation of one specific day at age 11; the historically supported pattern is that Kohli showed an unusually strong appetite for additional batting practice.\n\nLESSON: Useful Additional Effort\nPersistence is not simply working harder than everyone else; it is recognizing which additional effort is actually useful. At this age, there was no guarantee that more practice would produce greatness. The value of additional practice was that it created more opportunities to turn ability into repeatable skill.",
                choices: [
                    { text: "Complete Level", next: 'COMPLETE', score: 0, feedbackTitle: "", feedback: "" }
                ]
            }
        ]
    },

    // AGE 21: Ed Sheeran - Part 1
    'lvl_age_21_sheeran_1': {
        title: "The Photo She Might See",
        source: "Source: Interview on 16 February 2012",
        frames: [
            {
                id: 'intro',
                emotion: 'grief',
                bg: '/assets/bg-ed-sheeran-london-2012.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-ed-sheeran.png',
                text: "You are 21. Your career is moving faster than you expected. People recognize you now. Photographers are following you. Fans are watching.\n\nBut underneath all of that, something much more personal has recently ended. You have just come through a difficult breakup after a four-year relationship. You have barely spoken to your former girlfriend since it ended.\n\nThen a photograph appears of you with another girl. To everyone else, it may be just another celebrity photograph. To you, it carries a different weight. You know the person who matters may see it. You cannot control what the photograph means to someone else.\n\nAnd you have a difficult choice: Do you explain yourself? Do you stay silent? Or do you simply accept that the relationship is over and continue forward?",
                choices: [
                    {
                        text: "REACH OUT: Try to explain the situation rather than allowing a photograph to tell the entire story.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Connection",
                        feedback: "You find unresolved relationships difficult to leave without explanation. You value emotional clarity, even when reopening a conversation may hurt."
                    },
                    {
                        text: "SAY NOTHING: Accept that the relationship has ended and avoid creating another emotional confrontation.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Acceptance",
                        feedback: "You believe some endings become harder when you keep trying to control how the other person understands them."
                    },
                    {
                        text: "KEEP MOVING: Focus on work, friends and the life that is beginning to change around you. Do not chase closure.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Forward Motion",
                        feedback: "You cope with emotional pain by continuing to build the next chapter rather than remaining inside the previous one."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'grief',
                bg: '/assets/bg-ed-sheeran-london-2012.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-ed-sheeran.png',
                text: "HISTORICAL REALITY:\nIn an interview published on 16 February 2012, immediately before Sheeran's 21st birthday, he discussed a difficult breakup after four years. He said he had not really spoken to his former girlfriend since the breakup and was concerned about her seeing paparazzi photographs of him with another girl.\n\nThe historical record does NOT establish that he chose any of the three hypothetical approaches above. Therefore, there is no \"correct\" answer. The important historical fact is that Sheeran was entering age 21 while dealing with the aftermath of a significant relationship ending at the same time that his public profile was rapidly increasing.\n\nLESSON:\nSometimes personal loss does not wait for a convenient moment. A career can be accelerating while another part of your life is falling apart. The difficult part is not always choosing between success and failure. Sometimes it is learning how to carry personal pain while the rest of your life keeps moving.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },
    // AGE 21: Ed Sheeran - Part 2
    'lvl_age_21_sheeran_2': {
        title: "The People That Still Feel Like Home",
        source: "Source: August 2012 Interview",
        frames: [
            {
                id: 'intro',
                emotion: 'calm',
                bg: '/assets/bg-ed-sheeran-london-2012.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-ed-sheeran.png',
                text: "You are 21. Your calendar is filling up. There are performances. Travel. Writing. People asking for your time. More opportunities than before.\n\nBut there is another question underneath all of it. What happens to the people who knew you before all of this?\n\nYour friends still want to see you. Your family still wants you around. And your career keeps giving you reasons to leave again.\n\nYou have to decide what \"success\" is allowed to cost you. You cannot give everyone unlimited time. But you also cannot assume the people closest to you will always be there whenever you return.\n\nWhat do you prioritize?",
                choices: [
                    {
                        text: "GIVE THE CAREER EVERYTHING: Accept that this period of your life is temporary and give your work almost all of your attention.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Ambition",
                        feedback: "You are willing to accept personal sacrifice when you believe an opportunity may not come twice."
                    },
                    {
                        text: "PROTECT TIME FOR YOUR PEOPLE: Keep meaningful time for friends and family even if it means turning down or limiting some opportunities.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Connection",
                        feedback: "You believe success has less value if you become disconnected from the people who matter to you."
                    },
                    {
                        text: "BUILD A BALANCE: Keep pursuing the opportunities, but deliberately protect relationships and personal time instead of treating them as whatever remains after work.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Balance",
                        feedback: "You try to build success without allowing it to consume the rest of your life."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'calm',
                bg: '/assets/bg-ed-sheeran-london-2012.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-ed-sheeran.png',
                text: "HISTORICAL REALITY:\nIn an August 2012 interview, Sheeran spoke about the sacrifices involved in the life he was living. He described friends and family as central to what mattered to him and connected happiness with maintaining a good balance between those relationships and his work.\n\nThe historical record does NOT establish that he literally faced these exact three choices on a specific day. Instead, they represent a real tension in his life at that time.\n\nLESSON:\nSuccess changes your schedule before it changes your identity. The people who knew you before success can become even more important once everyone else starts wanting something from you.\n\nAmbition asks: \"What can I achieve?\"\nBalance asks: \"Who do I want beside me when I get there?\"",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 21: Selena Gomez - Part 1
    'lvl_age_21_selena_1': {
        title: "When Everyone Has an Opinion",
        source: "Source: Historical Context, 2013-2014",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'love',
                text: "Year: 2013. You are 21. You are old enough to know that your personal life belongs to you. But the world does not always treat it that way. Your relationship has become part of public conversation. Every appearance can become a headline. Every photograph can be interpreted. Every time you are seen together, people decide what it means.",
                choices: [
                    {
                        text: "A) PROTECT THE RELATIONSHIP: Keep personal matters as private as possible. Do not allow public opinion to determine what happens between two people.",
                        next: 'protect',
                        score: 0,
                        feedbackTitle: "Privacy",
                        feedback: "You believe important relationships should be protected from outside judgment."
                    },
                    {
                        text: "B) STEP BACK: Create emotional distance and give yourself room to figure out what you actually want.",
                        next: 'step_back',
                        score: 0,
                        feedbackTitle: "Self-Preservation",
                        feedback: "You prioritize understanding yourself before trying to satisfy someone else's expectations."
                    },
                    {
                        text: "C) KEEP TRYING: Accept that relationships can be complicated and continue trying to make the situation work despite the public attention.",
                        next: 'keep_trying',
                        score: 0,
                        feedbackTitle: "Commitment",
                        feedback: "You are willing to tolerate uncertainty when a relationship still matters to you."
                    }
                ]
            },
            {
                id: 'protect',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'love',
                text: "HISTORICAL REALITY:\nDuring 2013, Selena Gomez and Justin Bieber's relationship remained a major subject of public attention. Their relationship had already gone through periods of separation and reconciliation, and media coverage continued to follow their interactions.\n\nThe historical record does NOT establish that Selena faced the exact three choices above.\n\nAt 21, Selena was navigating a period in which her personal relationship was being discussed publicly while she was simultaneously trying to establish her own adult identity. The important historical context is not whether she made one perfect relationship decision. It is that her private life had become difficult to separate from her public identity.\n\nLESSON:\nA relationship becomes harder to understand when everyone outside it has an opinion. Sometimes growing up means learning the difference between: \"What do I actually want?\" and \"What does everyone expect me to want?\"",
                choices: []
            },
            {
                id: 'step_back',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'love',
                text: "HISTORICAL REALITY:\nDuring 2013, Selena Gomez and Justin Bieber's relationship remained a major subject of public attention. Their relationship had already gone through periods of separation and reconciliation, and media coverage continued to follow their interactions.\n\nThe historical record does NOT establish that Selena faced the exact three choices above.\n\nAt 21, Selena was navigating a period in which her personal relationship was being discussed publicly while she was simultaneously trying to establish her own adult identity. The important historical context is not whether she made one perfect relationship decision. It is that her private life had become difficult to separate from her public identity.\n\nLESSON:\nA relationship becomes harder to understand when everyone outside it has an opinion. Sometimes growing up means learning the difference between: \"What do I actually want?\" and \"What does everyone expect me to want?\"",
                choices: []
            },
            {
                id: 'keep_trying',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'love',
                text: "HISTORICAL REALITY:\nDuring 2013, Selena Gomez and Justin Bieber's relationship remained a major subject of public attention. Their relationship had already gone through periods of separation and reconciliation, and media coverage continued to follow their interactions.\n\nThe historical record does NOT establish that Selena faced the exact three choices above.\n\nAt 21, Selena was navigating a period in which her personal relationship was being discussed publicly while she was simultaneously trying to establish her own adult identity. The important historical context is not whether she made one perfect relationship decision. It is that her private life had become difficult to separate from her public identity.\n\nLESSON:\nA relationship becomes harder to understand when everyone outside it has an opinion. Sometimes growing up means learning the difference between: \"What do I actually want?\" and \"What does everyone expect me to want?\"",
                choices: []
            }
        ]
    },

    // AGE 21: Selena Gomez - Part 2
    'lvl_age_21_selena_2': {
        title: "Your Own Name",
        source: "Source: Historical Context, 2013-2014",
        frames: [
            {
                id: 'intro',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'determination',
                text: "People have known you for years. They have watched you grow up. They have opinions about what you should wear. What you should sing. Who you should date. What kind of person you should become. But you are changing. You are releasing your own music. You are moving into a more mature phase of your career. You have an opportunity to define yourself rather than simply continue the identity people already know. The question is: \"How much of the person people know is actually the person I want to become?\"",
                choices: [
                    {
                        text: "A) PLAY IT SAFE: Stay close to the image people already know. Make gradual changes rather than risking a strong reaction.",
                        next: 'play_safe',
                        score: 0,
                        feedbackTitle: "Security",
                        feedback: "You prefer controlled evolution over dramatic change."
                    },
                    {
                        text: "B) DEFINE YOURSELF: Use your music and creative choices to establish a more independent adult identity. Accept that some people may not immediately understand the change.",
                        next: 'define_yourself',
                        score: 0,
                        feedbackTitle: "Identity",
                        feedback: "You value becoming the person you choose to be over preserving everyone's existing expectations."
                    },
                    {
                        text: "C) CHANGE EVERYTHING: Take the opportunity to completely separate yourself from the version of you that people already know. Use this period as a complete reinvention.",
                        next: 'change_everything',
                        score: 0,
                        feedbackTitle: "Reinvention",
                        feedback: "You are willing to accept uncertainty and criticism if it gives you greater control over your identity."
                    }
                ]
            },
            {
                id: 'play_safe',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'determination',
                text: "HISTORICAL REALITY:\nIn 2013, Selena Gomez released Stars Dance. The album debuted at number one on the Billboard 200, becoming her first number-one album. She subsequently embarked on the Stars Dance Tour, her first solo world tour.\n\nThis period represented an important step toward establishing Selena as an independent recording artist rather than only the young performer audiences had known from her earlier career.\n\nThe historical record does NOT establish that she faced the exact three choices above.\n\nLESSON:\nGrowing up publicly is different from growing up privately. You may change before everyone else is ready to accept the change. The people who knew an earlier version of you may not immediately understand the person you are becoming. You do not need to remain the same person simply because other people became comfortable with who you used to be.",
                choices: []
            },
            {
                id: 'define_yourself',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'determination',
                text: "HISTORICAL REALITY:\nIn 2013, Selena Gomez released Stars Dance. The album debuted at number one on the Billboard 200, becoming her first number-one album. She subsequently embarked on the Stars Dance Tour, her first solo world tour.\n\nThis period represented an important step toward establishing Selena as an independent recording artist rather than only the young performer audiences had known from her earlier career.\n\nThe historical record does NOT establish that she faced the exact three choices above.\n\nLESSON:\nGrowing up publicly is different from growing up privately. You may change before everyone else is ready to accept the change. The people who knew an earlier version of you may not immediately understand the person you are becoming. You do not need to remain the same person simply because other people became comfortable with who you used to be.",
                choices: []
            },
            {
                id: 'change_everything',
                bg: '/assets/bg-selena-gomez-los-angeles-2013.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_selena.jpg?v=2',
                emotion: 'determination',
                text: "HISTORICAL REALITY:\nIn 2013, Selena Gomez released Stars Dance. The album debuted at number one on the Billboard 200, becoming her first number-one album. She subsequently embarked on the Stars Dance Tour, her first solo world tour.\n\nThis period represented an important step toward establishing Selena as an independent recording artist rather than only the young performer audiences had known from her earlier career.\n\nThe historical record does NOT establish that she faced the exact three choices above.\n\nLESSON:\nGrowing up publicly is different from growing up privately. You may change before everyone else is ready to accept the change. The people who knew an earlier version of you may not immediately understand the person you are becoming. You do not need to remain the same person simply because other people became comfortable with who you used to be.",
                choices: []
            }
        ]
    },

    // AGE 22: Tanmay Bhat - Part 1
    'lvl_age_22_tanmay_1': {
        title: "Just 200 People",
        source: "Source: Historical Context, 2012–2013",
        frames: [
            {
                id: 'intro',
                emotion: 'hope',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "You are 22. You are already working in comedy and writing. But you do not have a giant audience. There is no guarantee that people will show up.\n\nYou and Gursimran Khamba have started a comedy and pop-culture podcast. The idea is simple: talk about things you find funny and make something that feels like your own.\n\nYou could keep treating comedy as a series of individual performances and writing jobs. Or you could invest your time in this new project. The target is not enormous. You just want people to show up. Maybe 200. But even 200 people means something.\n\nHow seriously do you take an idea before it has proven itself?",
                choices: [
                    {
                        text: "KEEP IT SMALL: Treat the podcast as a side project. Continue prioritizing existing writing and comedy opportunities while experimenting with the podcast when time allows.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Security",
                        feedback: "You prefer to protect the opportunities that already exist before committing heavily to something uncertain."
                    },
                    {
                        text: "BET ON THE IDEA: Put serious time into the podcast. Accept that the project may fail, but give it enough attention to discover whether it can become something larger.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Risk",
                        feedback: "You are willing to invest in an uncertain possibility before there is evidence that it will work."
                    },
                    {
                        text: "BUILD IT WITH THE GROUP: Treat the project primarily as a collaborative experiment. Focus on finding the chemistry between different comedians rather than worrying about immediate scale.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Collaboration",
                        feedback: "You believe the right people and creative chemistry can matter more than having a perfect plan."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'hope',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "HISTORICAL REALITY:\nTanmay Bhat and Gursimran Khamba started the All India Bakchod podcast in March 2012. Rohan Joshi and Ashish Shakya subsequently became part of the group.\n\nThe early ambition was relatively modest. Tanmay later described wanting around 200 people in a room for a show. As the audience grew, the group's ambitions expanded.\n\nThe historical record does NOT establish that Tanmay faced these exact three choices. Therefore, do not tell the player that one option was \"correct.\" The historically important fact is that he DID choose to invest in the new collaborative comedy project.\n\nLESSON:\nYou do not always know whether an idea is good before you invest in it. Sometimes the first evidence is not success — it is simply that a few people care enough to come back. Small beginnings are still decisions.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 22: Tanmay Bhat - Part 2
    'lvl_age_22_tanmay_2': {
        title: "What If We Go Bigger?",
        source: "Source: Historical Context, 2012–2013",
        frames: [
            {
                id: 'intro',
                emotion: 'wonder',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "The experiment is no longer feeling completely invisible. The audience is growing. The group is developing chemistry. The idea that started small is becoming harder to ignore.\n\nYou have a choice: Do you keep the project exactly as it is? Do you start thinking bigger? Or do you expand carefully without losing what made the original idea enjoyable?\n\nThere is still no guarantee. You are only beginning to see the possibility.",
                choices: [
                    {
                        text: "KEEP THE ORIGINAL FORMULA: Do not chase growth. Keep making the kind of comedy that feels natural and enjoyable.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Authenticity",
                        feedback: "You prefer protecting the original creative identity rather than changing it for growth."
                    },
                    {
                        text: "THINK BIGGER: Start treating the project as something that could become a much larger comedy platform. Take the possibility seriously before there is certainty.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Vision",
                        feedback: "You naturally look beyond the current size of an opportunity."
                    },
                    {
                        text: "EXPERIMENT: Try new formats while keeping the original spirit. Use the audience response to discover what works instead of committing to one direction immediately.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Adaptability",
                        feedback: "You prefer learning through experimentation rather than making one irreversible commitment."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'wonder',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "HISTORICAL REALITY:\nThe group did expand. All India Bakchod developed beyond the original podcast format. In 2013, the four founders began making YouTube sketches.\n\nTanmay later recalled that their original expectations were modest, but the audience growth significantly exceeded what they initially imagined. Forbes India reported that after initially aiming for roughly 200 people in a room, the audience grew to 500 and beyond, eventually leading the group to recognize that they were building something much larger.\n\nThe experiment became bigger than its original expectations.\n\nLESSON:\nYou do not need to know that something will become huge before taking it seriously. Sometimes the most useful signal is simply that reality is exceeding your original expectations. When that happens, the next decision is not whether you were right — it is whether you are willing to change your plans because the world responded differently than you expected.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 21: Tanmay Bhat - Part 1
    'lvl_age_21_tanmay_1': {
        title: "Should I Really Do This?",
        source: "Source: Historical Context, 2008–2009",
        frames: [
            {
                id: 'intro',
                emotion: 'mystery',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "You are 21. Mumbai has a growing stand-up comedy scene. You have started performing at open mics. Sometimes the room laughs. Sometimes the material works. Sometimes it doesn't.\n\nYou are still figuring out what kind of comedian you are. You also have other skills and opportunities—writing, television work, creative work.\n\nBut stand-up is different. When you walk onto a stage, there is nowhere to hide. You have a few minutes. The microphone is in your hand. The audience decides immediately whether what you wrote is funny.\n\nYou have to decide how seriously you are willing to take this.",
                choices: [
                    {
                        text: "KEEP IT AS A SIDE THING: Continue performing occasionally, but do not allow comedy to become the center of your plans yet.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Security",
                        feedback: "You prefer to explore your talent without immediately putting your future on the line."
                    },
                    {
                        text: "TAKE THE STAGE SERIOUSLY: Commit to performing regularly. Accept that you will have bad sets, awkward rooms and rejection along the way.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Courage",
                        feedback: "You are willing to repeatedly expose yourself to failure in order to improve."
                    },
                    {
                        text: "FOCUS ON WRITING: Use your comedy instincts primarily through writing for television and other creative projects rather than making stand-up the main path.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Craft",
                        feedback: "You prefer developing your creative identity through preparation and writing rather than relying entirely on live performance."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'mystery',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "HISTORICAL REALITY:\nTanmay Bhat did enter the Mumbai stand-up circuit around 2008 and performed regularly at open-mic events. He continued developing as a performer while also working in writing and comedy-related creative work.\n\nThe historical record does NOT establish that he faced these exact three choices. The important historical reality is that he continued performing rather than treating comedy as a one-time experiment. By 2009, this path led to a significant breakthrough.\n\nLESSON:\nA creative career often begins before you have enough evidence to call it a career. At the beginning, you are not choosing between success and failure. You are choosing whether to keep showing up long enough to find out what you might become.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 21: Tanmay Bhat - Part 2
    'lvl_age_21_tanmay_2': {
        title: "The Five Minutes",
        source: "Source: Historical Context, 2008–2009",
        frames: [
            {
                id: 'intro',
                emotion: 'triumph',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "You have been performing. You have been testing material. You have learned that getting laughs consistently is much harder than getting lucky once.\n\nNow you have another opportunity: Weirdass Ham-ateur Night. It is a competition. You are not guaranteed to win. Other comedians are there. You have only a short amount of stage time to show what you can do.\n\nYou have to decide what kind of performer you want to be when those few minutes begin. Do you play it safe? Do you go for the biggest possible reaction? Or do you trust the material and style you have been developing?",
                choices: [
                    {
                        text: "PLAY IT SAFE: Use material you already know works. Minimize the risk of trying something experimental.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Reliability",
                        feedback: "You prefer maximizing the probability of a solid outcome rather than chasing a bigger but uncertain one."
                    },
                    {
                        text: "GO FOR THE BIG REACTION: Take a bigger creative risk. Use your strongest and most distinctive material even if the audience response could be unpredictable.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Boldness",
                        feedback: "You are comfortable accepting greater risk when the potential reward is meaningful."
                    },
                    {
                        text: "TRUST YOUR VOICE: Do not try to perform like anyone else. Focus on delivering the material in the style that feels most naturally yours.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Authenticity",
                        feedback: "You value developing a recognizable identity rather than optimizing only for immediate approval."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'triumph',
                bg: '/assets/portrait-tanmay-bhat.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-tanmay-bhat.png',
                text: "HISTORICAL REALITY:\nIn 2009, Tanmay Bhat won Vir Das's Weirdass Ham-ateur Night in Mumbai. The competition was described as a national comic hunt. Following the win, Bhat joined the Weirdass Comedy writing team and opened for Vir Das's Walking on Broken Das.\n\nThis was a meaningful early professional breakthrough.\n\nLESSON:\nSometimes the first breakthrough does not prove that you have figured everything out. It proves something smaller: There is enough here to keep going. A single opportunity can turn a possibility into evidence. But it is still only evidence. The next decision remains yours.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 21: Michael Jackson - Part 1
    'lvl_age_21_michael_1': {
        title: "Not Just the Jackson 5",
        source: "Source: Off the Wall Era, 1979–1980",
        frames: [
            {
                id: 'intro',
                emotion: 'liberation',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "You are 21. You have spent most of your life performing. People already know your voice. They know your dancing. They know the group you came from.\n\nBut now you are creating music as a solo artist. The expectations are complicated. People already have an idea of who Michael Jackson is. But the music you are making now does not have to simply repeat the past.\n\nYou are working with Quincy Jones. You are surrounded by extraordinary musicians. There are different sounds you could explore. Different writers. Different arrangements. Different ways to present yourself.\n\nYou have to decide: Do you stay close to the sound people already associate with you? Do you take the opportunity to experiment? Or do you try to combine your established strengths with something new?",
                choices: [
                    {
                        text: "STAY CLOSE TO WHAT PEOPLE KNOW: Build the album around the qualities audiences already associate with you. Do not risk moving too far away from the sound that already works.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Familiarity",
                        feedback: "You value stability and believe a strong existing identity should be protected while expanding."
                    },
                    {
                        text: "EXPERIMENT: Use this opportunity to explore new sounds, arrangements and musical influences. Accept that some choices may feel unfamiliar.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Curiosity",
                        feedback: "You are willing to explore uncertainty because discovery may reveal something you could not have planned."
                    },
                    {
                        text: "BUILD SOMETHING IN BETWEEN: Keep the strengths people already recognize while deliberately adding new influences and ideas.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Adaptability",
                        feedback: "You believe evolution does not require abandoning everything that came before."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'liberation',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "HISTORICAL REALITY:\nJackson's Off the Wall project did move into a more sophisticated adult R&B/pop direction. He worked with Quincy Jones and a group of major musicians and writers. The album included Jackson's own songwriting alongside contributions from artists such as Stevie Wonder and Paul McCartney.\n\nThe result was a record that separated his adult solo identity from the sound of his earlier Jackson 5 years.\n\nThe historical record does NOT establish that Jackson faced these exact three choices. The documented reality is that he did participate actively in shaping a new solo musical identity while collaborating with highly accomplished musicians.\n\nLESSON:\nGrowing up does not always mean becoming completely different. Sometimes it means deciding which parts of your old identity still belong to you. You do not have to reject where you came from to discover where you want to go.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 21: Michael Jackson - Part 2
    'lvl_age_21_michael_2': {
        title: "Good Enough or Your Best?",
        source: "Source: Off the Wall Era, 1979–1980",
        frames: [
            {
                id: 'intro',
                emotion: 'perfection',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "The music is taking shape. You have talented people around you. You have strong songs. You have ideas.\n\nBut you keep hearing small things that could be improved. Another vocal take. Another arrangement. Another rhythm. Another detail.\n\nThere is always something that could potentially become better. At some point, you have to decide whether to stop or continue refining.\n\nYou have three possible approaches.",
                choices: [
                    {
                        text: "KNOW WHEN TO STOP: Once the song communicates what you want, accept it and move forward.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Efficiency",
                        feedback: "You understand that endless refinement can become another form of hesitation."
                    },
                    {
                        text: "KEEP REFINING: Continue working until every detail feels as close as possible to what you imagined.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Perfectionism",
                        feedback: "You are willing to invest more time because small details can fundamentally change the final experience."
                    },
                    {
                        text: "TRUST THE TEAM: Listen carefully to the people around you and allow collaborators to tell you when the music is already working.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Trust",
                        feedback: "You understand that great creative work does not always come from controlling every decision yourself."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'perfection',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "HISTORICAL REALITY:\nOff the Wall was created through an unusually strong collaborative environment involving Quincy Jones, Jackson and many accomplished musicians, writers and engineers. Jackson contributed his own songwriting while also recording material written by other major artists.\n\nThe album ultimately became a major commercial and artistic success. \"Don't Stop 'Til You Get Enough\" became Jackson's first Grammy-winning song, and the album produced four Billboard Hot 100 Top 10 singles.\n\nLESSON:\nPerfection can be a strength. But creative work also requires knowing when to release something into the world. Sometimes the hardest part of making something great is accepting that eventually: the work has to leave your hands.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Michael Jackson - Part 1
    'lvl_age_15_michael_1': {
        title: "When Your Voice Changes",
        source: "Source: Historical Context, 1973–1974",
        frames: [
            {
                id: 'intro',
                emotion: 'confusion',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "You are 15, and your singing voice is beginning to change.\nThe sound that once came naturally does not feel the same anymore.\nHow will you adapt as your voice matures?",
                choices: [
                    {
                        text: "STAY WITH WHAT YOU KNOW: Keep using the style that has worked for you. Practise the old approach until you can make it feel natural again.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Consistency",
                        feedback: "You prefer improving something familiar rather than changing direction when things become difficult."
                    },
                    {
                        text: "LEARN THE NEW VERSION OF YOURSELF: Accept that your voice is changing. Instead of fighting it, practise until you understand what your new voice can do.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Adaptation",
                        feedback: "You are comfortable accepting change and learning how to work with it."
                    },
                    {
                        text: "TRY SOMETHING COMPLETELY DIFFERENT: Use the change as an opportunity. Experiment with different sounds, songs and ways of performing.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Exploration",
                        feedback: "You see change as a chance to discover abilities you may not have known you had."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'confusion',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "Michael continued recording and performing as his voice matured in 1973.\nHe adapted to physical changes while releasing new music.\n\nChanging does not mean getting worse.\nLearn to work with what you have now.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Michael Jackson - Part 2
    'lvl_age_15_michael_2': {
        title: "When People Expect the Old You",
        source: "Source: Historical Context, 1973–1974",
        frames: [
            {
                id: 'intro',
                emotion: 'courage',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "People still expect the child performer they became fans of.\nBut your voice and musical ideas are developing.\nHow much will you let past expectations shape your future?",
                choices: [
                    {
                        text: "GIVE PEOPLE WHAT THEY EXPECT: Stay close to the style people already love. There is value in giving an audience something familiar.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Responsibility",
                        feedback: "You care about the people who support you and do not want to change simply for yourself."
                    },
                    {
                        text: "FOLLOW YOUR OWN DEVELOPMENT: Accept that some people may need time to adjust. Focus on becoming the performer you are growing into.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Independence",
                        feedback: "You believe personal growth sometimes requires allowing other people to see a different version of you."
                    },
                    {
                        text: "CHANGE SLOWLY: Keep some familiar elements while gradually introducing new ideas. Give yourself and your audience time to adjust.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Balance",
                        feedback: "You believe growth does not have to mean throwing everything away at once."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'courage',
                bg: '/assets/bg-michael-jackson-van-nuys-1981.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-michael-jackson.png',
                text: "Michael continued developing as both a solo artist and Jackson 5 member.\nHe refused to remain frozen as a childhood star as he grew older.\n\nYou don't have to stay the same just because people liked who you were.\nReal growth happens when you allow yourself to evolve.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Bhagat Singh - Part 1
    'lvl_age_15_bhagat_1': {
        title: "Don't Just Be Angry",
        source: "Source: Historical Context, 1922–1923",
        frames: [
            {
                id: 'intro',
                emotion: 'anger',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "You are 15, growing up surrounded by political tension in Lahore.\nYou feel angry about unfairness, but how will you respond?\nWill you react immediately, stay out of it, or learn first?",
                choices: [
                    {
                        text: "ACT RIGHT AWAY: If something feels wrong, do not wait. Take some form of immediate action to show that you will not simply accept it.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Courage",
                        feedback: "You are willing to act even when you do not have all the answers. Risk: Acting before understanding the situation can lead to mistakes."
                    },
                    {
                        text: "STAY OUT OF IT: You are only 15. There are adults who understand politics better than you. Focus on your education and let other people deal with the larger problems.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Caution",
                        feedback: "You understand that strong emotions do not automatically mean you are ready to act. Risk: Waiting too long can become an excuse for never doing anything."
                    },
                    {
                        text: "LEARN BEFORE YOU ACT: Read. Ask questions. Listen to different opinions. Try to understand why people disagree before deciding what you believe.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Curiosity",
                        feedback: "You believe understanding a problem is the first step toward changing it. Risk: Learning can take time, while the problem you care about may still be happening."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'anger',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "Bhagat Singh spent his youth studying history and political ideas.\nHis beliefs were shaped through years of reading and discussion.\n\nFeeling strongly is important, but understanding comes first.\nBefore making a big decision, ask what you actually know.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Bhagat Singh - Part 2
    'lvl_age_15_bhagat_2': {
        title: "What If I'm Wrong?",
        source: "Source: Historical Context, 1922–1923",
        frames: [
            {
                id: 'intro',
                emotion: 'curiosity',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "Different people give completely opposite answers to the same problem.\nYou are 15 and don't have to pick a side immediately.\nHow will you decide what is right?",
                choices: [
                    {
                        text: "TRUST SOMEONE YOU RESPECT: Choose the view of a person whose judgment you trust. You do not have enough experience to understand everything yourself.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Trust",
                        feedback: "You value experience and believe learning from people you respect can prevent mistakes. Risk: A respected person can still be wrong."
                    },
                    {
                        text: "CHOOSE THE STRONGEST ARGUMENT: Do not care who said it. Choose the idea that appears to make the most sense.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Reason",
                        feedback: "You care more about the strength of an argument than the identity of the person making it. Risk: A convincing argument can still leave out important information."
                    },
                    {
                        text: "KEEP INVESTIGATING: Do not decide yet. Read more. Listen to opposing views. Ask questions. Change your mind if the evidence changes.",
                        next: 'reveal',
                        score: 10,
                        feedbackTitle: "Open-Mindedness",
                        feedback: "You are comfortable admitting that you do not know enough yet. Risk: Waiting for complete certainty can sometimes prevent action."
                    }
                ]
            },
            {
                id: 'reveal',
                emotion: 'curiosity',
                bg: '/assets/bg-bhagat-singh-lahore-1929.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-bhagat-singh.png',
                text: "Bhagat Singh became known for extensive reading and open-mindedness.\nHis ideas evolved through continuous learning and investigation.\n\nReal independence means explaining why you believe what you believe.\nStrong thinkers change their minds when they discover better information.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Rani Lakshmibai (One Continuous Story: The Girl and the Crown)
    'lvl_age_15_rani_lakshmibai': {
        title: "The Girl and the Crown",
        source: "Source: Historical Context, c. 1842–1844",
        frames: [
            // PART 1: A NEW NAME
            {
                id: 'intro',
                emotion: 'uncertainty',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "Yesterday you were Manu. Now you are Lakshmibai in Jhansi.\nYou face new royal customs and high expectations.\nHow will you step into this new life?",
                choices: [
                    {
                        text: "BECOME THE ROLE: Put your old life aside for now. Learn the customs. Learn the responsibilities. Focus on becoming the person this new role requires.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Responsibility",
                        feedback: "You are willing to change yourself when a new responsibility demands it. Risk: You may begin to lose touch with parts of yourself that once made you confident."
                    },
                    {
                        text: "HOLD ON TO MANU: Keep as much of your old identity as possible. Continue valuing the interests, confidence and independence that shaped you before the marriage.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Identity",
                        feedback: "You believe a new role should not erase the person you already are. Risk: Holding too tightly to the past can make adapting to a new life harder."
                    },
                    {
                        text: "TAKE BOTH WITH YOU: Learn the new responsibilities while keeping the qualities that made you who you were. You do not have to choose between Manu and Lakshmibai.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Adaptation",
                        feedback: "You believe growing up means adding new responsibilities without throwing away your old strengths. Risk: Trying to balance two identities can be harder than choosing one."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'uncertainty',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "Manikarnika married into Jhansi in 1842 and became Rani Lakshmibai.\nShe carried her active, independent childhood skills into court life.\n\nGrowing up sometimes means entering a role you did not create.\nYou can accept new responsibility without forgetting who you were.",
                choices: [
                    {
                        text: "Continue: What I Carry With Me",
                        next: 'part2_intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            // PART 2: WHAT I CARRY WITH ME
            {
                id: 'part2_intro',
                emotion: 'confidence',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "The new role is becoming part of your everyday life.\nNow comes the harder question: What parts of yourself will you keep?\nDecide what kind of strength you want to carry forward.",
                choices: [
                    {
                        text: "LEARN FIRST: Spend your time understanding the new responsibilities. Listen. Observe. Learn how things work before trying to change anything.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Patience",
                        feedback: "You believe understanding a situation deeply is the first step toward handling it well. Risk: Waiting too long can make others mistake patience for weakness."
                    },
                    {
                        text: "KEEP YOUR INDEPENDENCE: Continue developing the skills and confidence that were already part of your identity. Do not let your new position make you passive.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Self-Belief",
                        feedback: "You believe a new responsibility should make you stronger, not smaller. Risk: Confidence without enough understanding can become stubbornness."
                    },
                    {
                        text: "COMBINE BOTH: Learn the new world carefully while continuing to strengthen yourself. Do not rush. Do not disappear into the role. Build your own version of what the role can become.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Leadership",
                        feedback: "You believe real strength comes from combining knowledge, responsibility and confidence. Risk: This requires patience and effort because neither side can be ignored."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'confidence',
                bg: '/assets/bg-rani-lakshmibai-jhansi-1851.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-rani-lakshmibai.png',
                text: "Lakshmibai retained her childhood training and martial skills as Rani of Jhansi.\nShe entered her leadership role while still very young.\n\nGrowing up does not mean becoming a different person.\nTake what is strong inside you and learn how to use it responsibly.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Virat Kohli (One Continuous Story: More Than Your Own Score)
    'lvl_age_15_virat_kohli': {
        title: "More Than Your Own Score",
        source: "Source: Delhi Under-15 Cricket, 2003–2004",
        frames: [
            // PART 1: THE CAPTAIN'S BAT
            {
                id: 'intro',
                emotion: 'pride',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "You are 15 and leading Delhi's Under-15 team.\nEveryone is watching as you walk out to bat.\nWill you play for your personal score or for the team's needs?",
                choices: [
                    {
                        text: "PLAY FOR THE BIG SCORE: Attack. Try to score as many runs as possible. If you make a huge score, you may give the team the best chance of winning.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Ambition",
                        feedback: "You believe a leader should set the standard through personal performance. Strength: Your performance can inspire the team. Risk: You may focus too much on your own score."
                    },
                    {
                        text: "PLAY FOR THE TEAM'S SITUATION: Forget about your personal score. Read the match. Take fewer risks if the team needs stability. Attack only when the situation demands it.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Responsibility",
                        feedback: "You care more about what the team needs than what your own statistics look like. Strength: You make decisions based on the team's needs. Risk: You may miss the chance to take control of the match yourself."
                    },
                    {
                        text: "SET THE TONE, THEN ADAPT: Start positively. Show confidence. But change your approach depending on what the team needs.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Judgment",
                        feedback: "You believe leadership means knowing when to attack and when to be patient. Strength: You remain flexible. Risk: Constantly changing your approach can make decision-making harder."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'pride',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "Kohli captained Delhi U-15 in 2003–04, scoring 390 runs at an average of 78.\nHe combined top batting performance with team leadership.\n\nBeing skilled gets you noticed, but leading requires more.\nA captain is responsible for how their decisions affect the whole team.",
                choices: [
                    {
                        text: "Continue: The Team Needs You",
                        next: 'part2_intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            // PART 2: THE TEAM NEEDS YOU
            {
                id: 'part2_intro',
                emotion: 'frustration',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "Being captain made you feel trusted. Now teammates are making mistakes.\nThe match is getting tough, and frustration is setting in.\nHow will you help your team overcome this moment?",
                choices: [
                    {
                        text: "TAKE CONTROL YOURSELF: Do more. Score more. Lead from the front. If the team is struggling, try to carry the responsibility yourself.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Drive",
                        feedback: "When things go wrong, you naturally respond by increasing your own effort. Strength: You refuse to give up. Risk: You may unintentionally make teammates dependent on you."
                    },
                    {
                        text: "TALK TO THE TEAM: Stop focusing only on your own performance. Help teammates understand what they can do better. Give them confidence and make them feel involved.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Empathy",
                        feedback: "You understand that people often perform better when they feel trusted. Strength: You help others become better. Risk: You may spend too much energy helping others when the match still needs your own performance."
                    },
                    {
                        text: "BE DIRECT: Tell the players clearly what is going wrong. Do not insult them. Do not hide the problem. Be honest and expect them to improve.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Accountability",
                        feedback: "You believe people cannot improve if nobody tells them what they need to fix. Strength: Problems are confronted instead of ignored. Risk: Being correct does not always mean being effective."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'frustration',
                bg: '/assets/bg-virat-kohli-paschim-vihar-2000.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_virat_kohli.jpg',
                text: "Kohli progressed rapidly to Delhi's U-17 team, scoring 470 runs in 4 matches.\nHis leadership and performance continued to elevate his career.\n\nLeadership isn't just about being the best player.\nGreat leaders know when to carry the team, encourage others, or speak directly.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Ratan Tata (One Continuous Story: The Quiet Voice)
    'lvl_age_15_ratan_tata': {
        title: "The Quiet Voice",
        source: "Source: Historical Context, c. 1953",
        frames: [
            // PART 1: THE QUIET STUDENT
            {
                id: 'intro',
                emotion: 'shyness',
                bg: '/assets/bg_tata_cornell.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_ratan_tata.jpg',
                text: "You are 15, sitting in a classroom with an idea in mind.\nSpeaking out loud feels uncomfortable, but you think before you speak.\nHow will you handle your quiet nature?",
                choices: [
                    {
                        text: "STAY QUIET: If you are not comfortable speaking, do not force yourself. Listen carefully. Think. Speak only when you are sure.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Thoughtfulness",
                        feedback: "You prefer thinking carefully before putting your ideas into the world. Strength: You avoid speaking without understanding. Risk: People may never hear ideas that could have helped."
                    },
                    {
                        text: "FORCE YOURSELF TO SPEAK: Even if you feel nervous, raise your hand. Say what you think. Do not wait until you feel completely comfortable.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Courage",
                        feedback: "You believe confidence can grow only when you challenge yourself. Strength: You give yourself opportunities to become more comfortable. Risk: Forcing yourself too quickly can make speaking feel even more stressful."
                    },
                    {
                        text: "FIND ANOTHER WAY: If speaking in front of everyone feels difficult, express yourself through writing, small conversations or one-to-one discussions.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Self-Awareness",
                        feedback: "You understand that being quiet does not mean having nothing to say. Strength: You communicate in ways that feel natural to you. Risk: You may avoid situations where speaking publicly is actually necessary."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'shyness',
                bg: '/assets/bg_tata_cornell.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_ratan_tata.jpg',
                text: "Ratan Tata recalled being shy in school with a fear of public speaking.\nHe spent his youth thinking deeply rather than seeking assembly debates.\n\nBeing quiet is not the same as being weak.\nDon't let your quietness stop your ideas from being heard.",
                choices: [
                    {
                        text: "Continue: Say It Anyway",
                        next: 'part2_intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            // PART 2: SAY IT ANYWAY
            {
                id: 'part2_intro',
                emotion: 'self-belief',
                bg: '/assets/bg_tata_cornell.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_ratan_tata.jpg',
                text: "Being quiet is not a weakness, but you still want your voice to matter.\nYou can be quiet and still hold strong opinions.\nWhen someone asks for your view, how will you respond?",
                choices: [
                    {
                        text: "WAIT UNTIL YOU ARE CERTAIN: Think carefully. Check your idea. Speak only when you feel confident that you are right.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Carefulness",
                        feedback: "You value accuracy more than speed. Strength: You avoid careless decisions. Risk: Waiting for certainty can mean missing your chance to contribute."
                    },
                    {
                        text: "SPEAK EVEN IF YOU ARE NERVOUS: You do not need to know everything. Share your idea. Let the conversation help you improve it.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Confidence",
                        feedback: "You believe you can learn even after you speak. Strength: You give your ideas a chance to grow. Risk: You may sometimes speak before you have thought enough."
                    },
                    {
                        text: "LISTEN FIRST, THEN SPEAK: Do not rush. Hear what other people think. Then add your own view.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Balance",
                        feedback: "You believe good communication requires both listening and speaking. Strength: You learn from others without losing your own voice. Risk: You may spend so long listening that someone else speaks for you."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'self-belief',
                bg: '/assets/bg_tata_cornell.jpg',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_ratan_tata.jpg',
                text: "Ratan Tata's shyness did not prevent him from taking on great responsibilities.\nHis early quiet thoughtfulness laid the groundwork for strong leadership.\n\nYou don't have to become loud to be confident.\nConfidence is simply knowing your thoughts are worth sharing.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Elon Musk (One Continuous Story: The Thing You Love)
    'lvl_age_15_elon_musk': {
        title: "The Thing You Love",
        source: "Source: Historical Context, c. 1986",
        frames: [
            // PART 1: DIFFERENT
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg_musk_coding.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_elon_musk.png',
                text: "Sometimes you feel like you don't fit in.\nOther people may not understand what interests you.\nYou have to decide what to do with that feeling.",
                choices: [
                    {
                        text: "HIDE IT: Keep your interests private and try to fit in.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Belonging",
                        feedback: "You value belonging, but hiding yourself can limit you."
                    },
                    {
                        text: "IGNORE THE OPINIONS: Keep doing what interests you, even if others don't understand.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Independence",
                        feedback: "You value independence, but isolation can become a risk."
                    },
                    {
                        text: "FIND YOUR PEOPLE: Keep your interests and look for people who understand them.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Connection",
                        feedback: "You value connection without giving up who you are."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'loneliness',
                bg: '/assets/bg_musk_coding.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_elon_musk.png',
                text: "Musk was known as an introverted, bookish teenager.\nHe spent much of his time with books, computers and his own interests.\n\nBeing different is not automatically a weakness.\nSometimes the thing that makes you different is worth protecting.",
                choices: [
                    {
                        text: "Continue: Keep Building",
                        next: 'part2_intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            // PART 2: KEEP BUILDING
            {
                id: 'part2_intro',
                emotion: 'curiosity',
                bg: '/assets/bg_musk_coding.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_elon_musk.png',
                text: "You have found something that fascinates you.\nNow you have a choice: keep learning it, share it, or move on.\nWhat do you do?",
                choices: [
                    {
                        text: "GO DEEPER: Spend more time learning and understanding it.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Mastery",
                        feedback: "You value mastery, but you may miss other opportunities."
                    },
                    {
                        text: "BUILD SOMETHING: Stop only learning and try making something yourself.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Action",
                        feedback: "You value action, but your first attempts may fail."
                    },
                    {
                        text: "SHARE IT: Show someone what you have learned and hear their opinion.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Feedback",
                        feedback: "You value feedback, but other people's opinions may change your direction."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'curiosity',
                bg: '/assets/bg_musk_coding.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/avatar_elon_musk.png',
                text: "Musk had already taught himself programming and created Blastar years earlier.\nHis early interest in computers continued during his teenage years.\n\nYou don't need to know where an interest will lead.\nSometimes you just need to keep exploring it.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    },

    // AGE 15: Cristiano Ronaldo (One Continuous Story: Far From Home)
    'lvl_age_15_ronaldo': {
        title: "Far From Home",
        source: "Source: Historical Context, c. 2000",
        frames: [
            // PART 1: THE NEW BOY
            {
                id: 'intro',
                emotion: 'loneliness',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "Everyone around you sounds different.\nYou miss home, and people notice that you are different.\nDo you try to fit in or stay yourself?",
                choices: [
                    {
                        text: "FIT IN: Change how you act so people accept you.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Belonging",
                        feedback: "You value belonging. But fitting in can make you hide yourself."
                    },
                    {
                        text: "STAY YOURSELF: Keep your accent, personality and habits.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Identity",
                        feedback: "You value identity. But staying different can feel lonely."
                    },
                    {
                        text: "FIND YOUR PLACE: Stay yourself while slowly building new friendships.",
                        next: 'part1_reveal',
                        score: 10,
                        feedbackTitle: "Balance",
                        feedback: "You value balance. But finding your people takes time."
                    }
                ]
            },
            {
                id: 'part1_reveal',
                emotion: 'loneliness',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "Ronaldo struggled to adapt after moving to Lisbon.\nHe was teased for his accent and once wanted to leave.\n\nBeing different can feel lonely.\nIt does not mean you do not belong.",
                choices: [
                    {
                        text: "Continue: Stay or Keep Going",
                        next: 'part2_intro',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            },
            // PART 2: STAY OR KEEP GOING
            {
                id: 'part2_intro',
                emotion: 'determination',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "Leaving would make things easier.\nStaying means facing the same challenge again.\nWhat matters more to you?",
                choices: [
                    {
                        text: "KEEP GOING: Stay and give yourself more time to adapt.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Persistence",
                        feedback: "You value persistence. But persistence can become stubbornness."
                    },
                    {
                        text: "GO HOME: Choose your comfort and return to what feels familiar.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Well-Being",
                        feedback: "You value your well-being. Leaving can also mean giving up an opportunity."
                    },
                    {
                        text: "CHANGE YOUR APPROACH: Stay, but find a different way to handle the pressure.",
                        next: 'part2_reveal',
                        score: 10,
                        feedbackTitle: "Adaptability",
                        feedback: "You value adaptability. Changing your approach takes patience."
                    }
                ]
            },
            {
                id: 'part2_reveal',
                emotion: 'determination',
                bg: '/assets/bg-cristiano-ronaldo-manchester-2007.png',
                bgSize: 'object-contain',
                bgPosition: 'object-center bg-black',
                portrait: '/assets/portrait-cristiano-ronaldo.png',
                text: "Ronaldo stayed in Lisbon and continued with Sporting.\nHis difficult adjustment became part of his early football journey.\n\nSometimes the hardest part is simply staying.\nBut staying does not mean refusing to change.",
                choices: [
                    {
                        text: "Complete Level",
                        next: 'COMPLETE',
                        score: 0,
                        feedbackTitle: "",
                        feedback: ""
                    }
                ]
            }
        ]
    }
};
