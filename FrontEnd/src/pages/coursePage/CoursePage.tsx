import React, { useState } from "react"
import styles from './CoursePage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";

interface CourseSection {
  title: string;
  subSections: string[];
}
  
const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (ind: number) => {
    setOpenSection(openSection === ind ? null : ind);
  }

  return (
    <div className={styles.course__content}>
      <h1>Содержание курса</h1>
      <div>
        {courseContent.map((section, index) => (
          <div key={index}>
            <div className={styles.section__title} onClick = {() => toggleSection(index)}>
              <h2>{section.title}</h2>
              <span>{openSection === index ? '▲' : '▼'}</span>
            </div>
            {openSection === index && (
              <ul className={`${styles.subsections} ${openSection === index ? styles.open : ''}`}>
                {section.subSections.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            )}
          </div> 
        ))}
      </div>
    </div>
  )
}

export default CourseContent;