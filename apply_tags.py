import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
  ('<p class="hero-eyebrow"><span>AI Specialist · Marketing Manager</span></p>', '<p class="hero-eyebrow"><span data-i18n="hero_eyebrow">AI Specialist · Marketing Manager</span></p>'),
  ('<span class="tl"><span>Ilkhom</span></span>', '<span class="tl"><span data-i18n="hero_t1">Ilkhom</span></span>'),
  ('<span class="tl"><span>Shaki&shy;rov</span></span>', '<span class="tl"><span data-i18n="hero_t2">Shaki&shy;rov</span></span>'),
  ('<span>Tashkent based. Building experience in Artificial Intelligence and Marketing through real projects in social media, content creation, and brand growth.</span>', '<span data-i18n="hero_desc">Tashkent based. Building experience in Artificial Intelligence and Marketing through real projects in social media, content creation, and brand growth.</span>'),
  ('<div class="pill available"><span class="pill-dot"></span>Available for work</div>', '<div class="pill available"><span class="pill-dot"></span><span data-i18n="hero_pill1">Available for work</span></div>'),
  ('<div class="pill">Tashkent, Uzbekistan</div>', '<div class="pill" data-i18n="hero_pill2">Tashkent, Uzbekistan</div>'),
  ('<span>Scroll</span>', '<span data-i18n="scroll_hint">Scroll</span>'),
  
  ('<span class="mq-item">Artificial Intelligence</span>', '<span class="mq-item" data-i18n="mq_ai">Artificial Intelligence</span>'),
  ('<span class="mq-item">Marketing Strategy</span>', '<span class="mq-item" data-i18n="mq_marketing">Marketing Strategy</span>'),
  ('<span class="mq-item">Social Media Management</span>', '<span class="mq-item" data-i18n="mq_social">Social Media Management</span>'),
  ('<span class="mq-item">Content Creation</span>', '<span class="mq-item" data-i18n="mq_content">Content Creation</span>'),
  ('<span class="mq-item">Brand Growth</span>', '<span class="mq-item" data-i18n="mq_brand">Brand Growth</span>'),
  ('<span class="mq-item">Audience Engagement</span>', '<span class="mq-item" data-i18n="mq_audience">Audience Engagement</span>'),
  ('<span class="mq-item">Digital Marketing</span>', '<span class="mq-item" data-i18n="mq_digital">Digital Marketing</span>'),
  ('<span class="mq-item">AI Tools</span>', '<span class="mq-item" data-i18n="mq_tools">AI Tools</span>'),
  ('<span class="mq-item">Automation</span>', '<span class="mq-item" data-i18n="mq_automation">Automation</span>'),
  ('<span class="mq-item">Creative Thinking</span>', '<span class="mq-item" data-i18n="mq_creative">Creative Thinking</span>'),
  ('<span class="mq-item">Team Collaboration</span>', '<span class="mq-item" data-i18n="mq_team">Team Collaboration</span>'),
  ('<span class="mq-item">Communication</span>', '<span class="mq-item" data-i18n="mq_communication">Communication</span>'),
  ('<span class="mq-item">Market Research</span>', '<span class="mq-item" data-i18n="mq_research">Market Research</span>'),
  
  ('<p class="s-label">Selected work</p>', '<p class="s-label" data-i18n="work_label">Selected work</p>'),
  ('<h3 class="pname">OU7 Training</h3>', '<h3 class="pname" data-i18n="work1_title">OU7 Training</h3>'),
  ('<p class="prole">Brand Manager</p>', '<p class="prole" data-i18n="work1_role">Brand Manager</p>'),
  ('<h3 class="pname">Chotqol</h3>', '<h3 class="pname" data-i18n="work2_title">Chotqol</h3>'),
  ('<p class="prole">Marketing Manager</p>', '<p class="prole" data-i18n="work2_role">Marketing Manager</p>'),
  ('<h3 class="pname">Modera</h3>', '<h3 class="pname" data-i18n="work3_title">Modera</h3>'),
  ('<p class="prole">Content Creator</p>', '<p class="prole" data-i18n="work3_role">Content Creator</p>'),
  ('<div class="btn-text">View archive</div>', '<div class="btn-text" data-i18n="view_archive">View archive</div>'),
  
  ('<p class="s-label">About me</p>', '<p class="s-label" data-i18n="about_label">About me</p>'),
  ('<span>I am a marketing professional</span>', '<span data-i18n="about_desc">I am a marketing professional</span>'),
  ('<p class="s-label">Experience</p>', '<p class="s-label" data-i18n="exp_label">Experience</p>'),
  ('<p class="ei-co">Modera</p>', '<p class="ei-co" data-i18n="exp1_co">Modera</p>'),
  ('<p class="ei-role">Content Creator</p>', '<p class="ei-role" data-i18n="exp1_role">Content Creator</p>'),
  ('<p class="ei-yr">10.2025 - Present</p>', '<p class="ei-yr" data-i18n="exp1_yr">10.2025 - Present</p>'),
  ('<p class="ei-co">OU7 Training</p>', '<p class="ei-co" data-i18n="exp2_co">OU7 Training</p>'),
  ('<p class="ei-role">Brand Manager</p>', '<p class="ei-role" data-i18n="exp2_role">Brand Manager</p>'),
  ('<p class="ei-yr">08.2025 - 09.2025</p>', '<p class="ei-yr" data-i18n="exp2_yr">08.2025 - 09.2025</p>'),
  ('<p class="ei-co">Chotqol Sanatorium</p>', '<p class="ei-co" data-i18n="exp3_co">Chotqol Sanatorium</p>'),
  ('<p class="ei-role">Assistant Marketing Manager</p>', '<p class="ei-role" data-i18n="exp3_role">Assistant Marketing Manager</p>'),
  ('<p class="ei-yr">01.2024 - 05.2025</p>', '<p class="ei-yr" data-i18n="exp3_yr">01.2024 - 05.2025</p>'),
  
  ('<p class="s-label">Get in touch</p>', '<p class="s-label" data-i18n="contact_label">Get in touch</p>'),
  ('<span class="tl"><span>Say hi!</span></span>', '<span class="tl"><span data-i18n="contact_hi">Say hi!</span></span>'),
  ('<p>Tashkent, Uzbekistan</p>', '<p data-i18n="contact_location">Tashkent, Uzbekistan</p>'),
  ('<a href="mailto:ilhomjonshakirov7@gmail.com" data-cursor="hi">Email</a>', '<a href="mailto:ilhomjonshakirov7@gmail.com" data-cursor="hi" data-i18n="footer_email">Email</a>'),
  ('<p class="copy">© 2026 Ilkhom Shakirov · AI Specialist · Marketing Manager</p>', '<p class="copy" data-i18n="footer_copy">© 2026 Ilkhom Shakirov · AI Specialist · Marketing Manager</p>'),
  
  ('<div class="rk-cell"><a href="#hero">Agencies</a></div>', '<div class="rk-cell"><a href="#hero" data-i18n="tb_agencies">Agencies</a></div>'),
  ('<div class="rk-cell"><a href="#hero">Brands</a></div>', '<div class="rk-cell"><a href="#hero" data-i18n="tb_brands">Brands</a></div>'),
  ('<div class="rk-cell"><a href="#work">Works</a></div>', '<div class="rk-cell"><a href="#work" data-i18n="tb_works">Works</a></div>'),
  ('<div class="rk-cell"><a href="#about">Insights</a></div>', '<div class="rk-cell"><a href="#about" data-i18n="tb_insights">Insights</a></div>'),
  ('<div class="rk-cell"><a href="#about">About</a></div>', '<div class="rk-cell"><a href="#about" data-i18n="tb_about">About</a></div>'),
  ('<div class="rk-cell"><a href="#contact">Contact</a></div>', '<div class="rk-cell"><a href="#contact" data-i18n="tb_contact">Contact</a></div>'),
  
  ('<span>Directory</span>', '<span data-i18n="tb_dir">Directory</span>'),
  ('<span>Sound</span>', '<span data-i18n="tb_sound">Sound</span>'),
  
  ('<li><a href="#work">Work</a></li>', '<li><a href="#work" data-i18n="nav_work">Work</a></li>'),
  ('<li><a href="#about">About</a></li>', '<li><a href="#about" data-i18n="nav_about">About</a></li>'),
  ('<li><a href="#contact">Contact</a></li>', '<li><a href="#contact" data-i18n="nav_contact">Contact</a></li>'),
  
  ('<span id="tLabel">Light</span>', '<span id="tLabel" data-i18n="theme_light">Light</span>'),
  (">Let's talk <svg", '><span data-i18n="contact_talk">Let\'s talk</span> <svg')
]

for s, r in replacements:
    html = html.replace(s, r)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Tags applied successfully!")
