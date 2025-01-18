import React, { useState } from "react";
import styles from './CoursePage.module.scss';
import courseContent from "../../assets/dataBase/TitlesData.json";

const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (ind: number) => {
    setOpenSection(openSection === ind ? null : ind);
  };

  return (
    <div className={styles.course__content}>
      <h1 className={styles.title}>Содержание курса</h1>
      <div>
        {courseContent.map((section, index) => (
          <div key={index} className={styles.section}>
            <div 
              className={styles.section__title} 
              onClick={() => toggleSection(index)}
            >
              {/* Кружок с номером */}
              <div className={styles.circle}>
                <span className={styles.number}>{index + 1}</span>
              </div>
              {/* Заголовок секции */}
              <h2 className={styles.subtitle}>{section.title}</h2>
              {/* Стрелка */}
              <span className={`${styles.arrow} ${openSection === index ? styles.open : ''}`}></span>
            </div>
            {openSection === index && (
              <ul className={styles.course__box}>
                {section.subSections.map((sub, idx) => (
                  <li key={idx} className={styles.listItem}>{sub}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
