// Let global variables
let resumeData;

let hoverStartTime = null;
let hoverTimeout = null;

// Function to show tooltip
function hoverSkill(event, skill) {
    const tooltip = document.getElementById('tooltip');
    
    // Clear existing content
    tooltip.innerHTML = '';

    // Create and style level box
    const tooltip_level_box = document.createElement('div');
    tooltip_level_box.classList.add('tooltip-level-box');

    const tooltip_level = document.createElement('p');
    tooltip_level.classList.add('tooltip-level');
    const skill_level_hue = calculateLvlHue(skill.level) || "white";
    tooltip_level.style.color = 'hsl(' + skill_level_hue + ', 90%, 35%)';
    tooltip_level.innerText = skill.level || '404';

    tooltip_level_box.appendChild(tooltip_level);

    // Create description element
    const tooltip_description = document.createElement('p');
    tooltip_description.classList.add('tooltip-description');
    tooltip_description.innerText = skill.description || 'No description available';

    // Append level box and description to tooltip
    tooltip.appendChild(tooltip_level_box);
    tooltip.appendChild(tooltip_description);

    // Display and position the tooltip
    tooltip.style.display = 'flex';
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY + 10 + 'px';
    tooltip.style.opacity = 1;

    // Start hover timer
    hoverStartTime = new Date();  // Capture when the hover starts
}

// Function to hide tooltip
function hideTooltip(skill) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
    tooltip.style.opacity = 0;

    // Calculate hover duration
    const hoverEndTime = new Date();
    const hoverDuration = (hoverEndTime - hoverStartTime) / 1000;  // Hover duration in seconds

    // Check if hover lasted at least 2 seconds before pushing to data layer
    if (hoverDuration >= 1) {
        var skill_group;
        if ("tool" in skill) {
            skill_group = 'tool';
        } else if ("language" in skill) {
            skill_group = 'programming';
        } else {
            skill_group = 'other';
        }

        // Push to data layer
        pushToDataLayer({
            event: 'hover_skill',
            skill_group: skill_group,
            skill: skill.tool || skill.language || 'other',
            time_hovered: hoverDuration
        });
    }

    // Reset hover start time
    hoverStartTime = null;
}

// Function to calculate hue of skill levels
function calculateLvlHue(lvl) {
    var lvl_hue;
    
    const min_lvl = 45;
    const max_lvl = 100;
    const min_hue = 0;
    const max_hue = 120;

    if (lvl < min_lvl) {
        lvl_hue = min_hue;
    } else {
        lvl_hue = ((lvl - min_lvl) / (max_lvl - min_lvl)) * (max_hue - min_hue) + min_hue;
    }

    return lvl_hue;
}

// Build content of resume
function buildResume() {
    function buildAbout() {
        function buildPhoto() {
            function setPhoto() {
                const photo_placeholder = document.getElementById('photo');
                photo_placeholder.src = "assets/images/" + resumeData.personal.photo;
            }

            function setTitle() {
                const title_placeholder = document.getElementById('title');
                title_placeholder.innerText = resumeData.personal.title;
            }

            setPhoto();
            setTitle();
        }

        function buildIntro() {
            const about_placeholder = document.getElementById('introduction');
    
            const about_intro_div = document.createElement('div');
            const about_introduction = document.createElement('p');
            about_introduction.classList.add('introduction');
            about_introduction.innerText = resumeData.personal.introduction;
            const about_quote = document.createElement('p');
            about_quote.classList.add('quote');
            about_quote.innerText = resumeData.personal.quote;
            about_intro_div.appendChild(about_introduction);
            about_intro_div.appendChild(about_quote);
            about_placeholder.appendChild(about_intro_div);
        }

        function buildContact() {
            function buildContactLanguages() {
                function buildLanguage(lang, lvl) {
                    const language_div = document.createElement('div');
                    language_div.style.width = "61%";
                    
                    const language_name = document.createElement('span');
                    language_name.classList.add('lang-name');
                    language_name.innerText = lang;
                    language_div.appendChild(language_name);

                    const language_level = document.createElement('span');
                    language_level.classList.add('lang-lvl');
                    language_level.innerText = lvl;
                    language_div.appendChild(language_level);

                    const language_bar = document.createElement('hr');
                    language_bar.classList.add('lang-bar');
                    language_bar.style.width = lvl + "%";
                    const language_bar_hue = calculateLvlHue(lvl);
                    language_bar.style.borderColor = 'hsl(' + language_bar_hue + ', 90%, 35%)';
                    language_div.appendChild(language_bar);

                    return language_div;
                }

                const contact_languages = document.createElement('div');
                contact_languages.classList.add('contact-languages');
                const languages_header = document.createElement('h3');
                languages_header.classList.add('lang-header');
                languages_header.innerText = "Contact me in";
                contact_languages.appendChild(languages_header);

                const languages_view = document.createElement('div');
                languages_view.classList.add('lang-view');

                for (const [language, level] of Object.entries(resumeData.skills.linguistic)) {
                    languages_view.appendChild(buildLanguage(language, level));
                }

                contact_languages.appendChild(languages_view);

                return contact_languages;
            }

            const contact_placeholder = document.getElementById('contact');
            if ("email" in resumeData.personal.contact) {
                my_email = resumeData.personal.contact.email;
                
                const email_a = document.createElement('a');
                email_a.innerText = my_email;
                email_a.href = "mailto:" + my_email;
                email_a.classList.add('contact-clickout');
                email_a.dataset.contact = my_email;
                contact_placeholder.appendChild(email_a);
            }

            if ("phone" in resumeData.personal.contact) {
                my_phone = resumeData.personal.contact.phone;
                
                const phone_a = document.createElement('a');
                phone_a.innerText = my_phone;
                phone_a.href = "tel:" + my_phone;
                phone_a.classList.add('contact-clickout');
                phone_a.dataset.contact = my_phone;
                contact_placeholder.appendChild(phone_a);
            }

            if ("address" in resumeData.personal.contact) {
                address = resumeData.personal.contact.address;
                
                const address_div = document.createElement('div');
                address_div.classList.add('address');
                const address_strnum = document.createElement('p');
                address_strnum.innerText = address.street + " " + address.number;
                const address_zipcity = document.createElement('p');
                address_zipcity.innerText = address.zip + ", " + address.city;
                const address_country = document.createElement('p');
                address_country.innerText = address.country;

                address_div.appendChild(address_strnum);
                address_div.appendChild(address_zipcity);
                address_div.appendChild(address_country);

                contact_placeholder.appendChild(address_div);
            }

            contact_me_in_div = buildContactLanguages();
            contact_placeholder.appendChild(contact_me_in_div);

            if ("socials" in resumeData.personal.contact) {
                const social_div = document.createElement('div');
                social_div.classList.add('social-container');
                for (const [social, metadata] of Object.entries(resumeData.personal.contact.socials)) {
                    const soc_logo_a = document.createElement('a');
                    soc_logo_a.href = metadata.url;
                    soc_logo_a.classList.add('social-btn');
                    soc_logo_a.dataset.social = social;
                    soc_logo_a.target = "_blank";
                    const soc_logo = document.createElement('img');
                    soc_logo.src = "assets/images/logos/" + metadata.logo;
                    soc_logo_a.appendChild(soc_logo);
                    social_div.appendChild(soc_logo_a);
                }
            
            contact_placeholder.appendChild(social_div);
            }
        }

        buildPhoto();
        buildIntro();
        buildContact();
    }

    function buildTimeline() {
        function buildSkills() {
            const skills_placeholder = document.getElementById('skills');
        
            const skills_ul = document.createElement('ul');
            skills_ul.classList.add('list-inline');
        
            resumeData.skills.tools.forEach(skill => {
                const skill_li = document.createElement('li');
                skill_li.classList.add(...['list-inline-item', 'badge', 'skill-tools']);
                skill_li.onmouseover = (event) => hoverSkill(event, skill);
                skill_li.onmouseout = () => hideTooltip(skill);
                skill_li.innerText = skill.tool;
                skills_ul.appendChild(skill_li);
            });
        
            resumeData.skills.programming.forEach(skill => {
                const skill_li = document.createElement('li');
                skill_li.classList.add(...['list-inline-item', 'badge', 'skill-programming']);
                skill_li.onmouseover = (event) => hoverSkill(event, skill);
                skill_li.onmouseout = () => hideTooltip(skill);
                skill_li.innerText = skill.language;
                skills_ul.appendChild(skill_li);
            });
        
            skills_placeholder.appendChild(skills_ul);
        }

        function buildExperience() {
            const experience_placeholder = document.getElementById('experience');
    
            const experience_ul = document.createElement('ul');
            experience_ul.classList.add('list-unstyled');

            resumeData.experience.forEach(exp => {
                const exp_li = document.createElement('li');
                exp_li.classList.add(...['media', 'mb-3', 'emp_' + exp.employer_id]);
                
                const exp_img_a = document.createElement('a');
                exp_img_a.classList.add('experience-clickout');
                exp_img_a.dataset.employer = exp.employer;
                exp_img_a.href = exp.url;
                exp_img_a.target = "_blank";
                const exp_img = document.createElement('img');
                exp_img.classList.add('mr-3');
                exp_img.alt = exp.employer + ' logo';
                exp_img.style.width = "64px";
                exp_img.style.height = "64px";
                exp_img.src = "assets/images/logos/" + exp.logo;
                exp_img_a.appendChild(exp_img);
                exp_li.appendChild(exp_img_a);
    
                const exp_div = document.createElement('div');
                exp_div.classList.add('media-body');
                exp_li.appendChild(exp_div);
    
                const exp_employer = document.createElement('h5');
                exp_employer.classList.add(...['mt-0', 'mb-1']);
                exp_employer.innerText = exp.employer + " | ";
                const exp_title = document.createElement('span');
                exp_title.classList.add(...['mt-0', 'mb-1', 'exp-title']);
                exp_title.innerText = exp.title + " | ";
                const exp_timespan = document.createElement('span');
                exp_timespan.classList.add('timespan');
                exp_timespan.innerText = exp.period.start + " - " + exp.period.end;
                exp_employer.appendChild(exp_title);
                exp_employer.appendChild(exp_timespan);
                exp_div.appendChild(exp_employer);

                if (exp.note.length > 0) {
                    const exp_note = document.createElement('p');
                    exp_note.classList.add('exp-note');
                    exp_note.innerText = exp.note;
                    exp_div.appendChild(exp_note);
                }
    
                const skills_header = document.createElement('p');
                skills_header.innerText = "Most relevant skills";
                skills_header.classList.add('skills-header');
                exp_div.appendChild(skills_header);

                const relevant_skills_ul = document.createElement('ul');
                relevant_skills_ul.classList.add('no-border');
                relevant_skills_ul.classList.add('list-inline');
                relevant_skills_ul.style.width = "85%";
    
                for (const [type, skills] of Object.entries(exp.relevant_skills)) {
                    for (const [key, value] of Object.entries(skills)) {
                        const skill_li = document.createElement('li');
                        skill_li.classList.add(...['list-inline-item', 'badge', 'skill-' + type]);
                        skill_li.innerText = key;
                        relevant_skills_ul.appendChild(skill_li);
                    }
                }

                exp_div.appendChild(relevant_skills_ul);
    
                const exp_desc = document.createElement('p');
                exp_desc.classList.add('exp-desc');
                exp_desc.innerText = exp.description;
                exp_div.appendChild(exp_desc);
    
                exp_li.appendChild(exp_div);
    
                experience_ul.appendChild(exp_li);
            });
    
            experience_placeholder.appendChild(experience_ul);
        }

        function buildEducation() {
            function buildMinor(minor) {
                const minor_div = document.createElement('div');
                const minor_title_a = document.createElement('a');
                minor_title_a.href = minor.url;
                minor_title_a.target = "_blank";
                minor_title_a.classList.add('minor-title');
                const minor_title = document.createElement('h6');
                minor_title.innerHTML = minor.title + " - <span class='grade'>" + minor.grade + "</span>";
                minor_title_a.appendChild(minor_title);
                minor_div.appendChild(minor_title_a);
                const minor_description = document.createElement('p');
                minor_description.innerText = minor.description;
                minor_div.appendChild(minor_description);
                return minor_div;
            }

            const education_placeholder = document.getElementById('education');
    
            const education_ul = document.createElement('ul');
            education_ul.classList.add('list-unstyled');

            resumeData.education.forEach(edu => {
                const edu_li = document.createElement('li');
                edu_li.classList.add(...['media', 'mb-3', 'edu_' + edu.education_id]);
                
                const edu_img_a = document.createElement('a');
                edu_img_a.classList.add('education-clickout');
                edu_img_a.dataset.institute = edu.institute;
                edu_img_a.href = edu.url;
                edu_img_a.target = "_blank";
                const edu_img = document.createElement('img');
                edu_img.classList.add('mr-3');
                edu_img.alt = edu.institute + ' logo';
                edu_img.style.width = "64px";
                edu_img.style.height = "64px";
                edu_img.src = "assets/images/logos/" + edu.logo;
                edu_img_a.appendChild(edu_img);
                edu_li.appendChild(edu_img_a);
                
                const edu_div = document.createElement('div');
                edu_div.classList.add('media-body');
                edu_li.appendChild(edu_div);

                const edu_title = document.createElement('h5');
                edu_title.classList.add(...['mt-0', 'mb-1']);
                edu_title.innerText = edu.institute + " | ";
                const edu_timespan = document.createElement('span');
                edu_timespan.classList.add('timespan');
                edu_timespan.innerText = edu.period.start + " - " + edu.period.end;
                edu_title.appendChild(edu_timespan);
                edu_div.appendChild(edu_title);

                const edu_course = document.createElement('p');
                edu_course.classList.add('edu-course');
                edu_course.innerText = edu.course;
                edu_div.appendChild(edu_course);

                const edu_level = document.createElement('p');
                edu_level.classList.add('edu-level');
                edu_level.innerText = edu.level;
                edu_div.appendChild(edu_level);

                const edu_details = document.createElement('div');
                edu_details.classList.add('edu-details');

                const edu_thesis = document.createElement('div');
                edu_thesis.classList.add('edu-thesis');
                const edu_thesis_header = document.createElement('h6');
                edu_thesis_header.innerHTML = 'Thesis - <span class="thesis-grade">' + edu.thesis.grade + '</span>';
                const edu_thesis_title = document.createElement('p');
                edu_thesis_title.innerText = '"' + edu.thesis.title + '"';
                edu_thesis_title.classList.add('thesis-title');
                edu_thesis.appendChild(edu_thesis_header);
                edu_thesis.appendChild(edu_thesis_title);
                edu_details.appendChild(edu_thesis);

                if (edu.minors.length > 0) {
                    const minors_header = document.createElement('h6');
                    minors_header.innerText = 'Minors';
                    edu_details.appendChild(minors_header);

                    edu.minors.forEach(minor => {
                        minor_div = buildMinor(minor);
                        minor_div.classList.add('minor');
                        edu_details.appendChild(minor_div);
                    })
                }
                

                edu_div.appendChild(edu_details);

                edu_li.appendChild(edu_div);
    
                education_ul.appendChild(edu_li);
            });
            
            education_placeholder.appendChild(education_ul);
        }

        buildSkills();
        buildExperience();
        buildEducation();
    }

    buildAbout();
    buildTimeline();
}

// Initiate resume object
document.addEventListener('DOMContentLoaded', function() {
    fetch('resume.json')
        .then(response => response.json())
        .then(data => {
            resumeData = data;
        })
        .then(() => {
            buildResume();
        })
        .then(() => {
            document.dispatchEvent(new Event('resumeFinished'));
        })
        .then(() => {
            placeDataLayerListeners();
        })
        .catch(error => {
            console.error('Error fetching resume data:', error);
        });
});
