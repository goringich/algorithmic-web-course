import React, { useState } from "react"
import styles from './CoursePage.module.scss';

interface CourseSection {
  title: string;
  subSections: string[];
}

const courseContent: CourseSection[] = [
  {
    title: "Структуры данных и алгоритмы обработки гапазонов",
    subSections: [
      "Дерево отрезков (ДО)",
      "Дерево отрезков с суммами",
      "Дерево отрезков с минимальными/максимальными значениями",
      "Дерево отрезков с добавлением модификаторов (range update)",
      "Дерево Фенwick",
      "Дерево Фенwick для подсчета суммы на префиксе",
      "Дерево Фенwick с ускоренными расширениями",
      "Процесс дерева отрезков",
      "Дерево отрезков с линейной сложностью построения",
      "Поддержка поиска наибольшего общего делителя (НОД)",
      "Ленивое дерево отрезков",
      "Дерево отрезков с осложненными обновлениями и динамическим изменением гапазонов"
    ]
  },
  {
    title: "Алгоритмы обработки координат и анализа пространственных данных",
    subSections: []
  },
  {
    title: "Декомпозиционные методы",
    subSections: []
  },
  {
    title: "Методы поиска и преобращений",
    subSections: []
  },
  {
    title: "Алгоритмы потоков в сетях",
    subSections: []
  },
  {
    title: "Геометрические алгоритмы",
    subSections: []
  }
]
  
const CourseContent: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (ind: number) => {
    setOpenSection(openSection === ind ? null : ind);
  }

  return (
    <div className="course-content">
      <h1>Содержание курса</h1>
      <div>
        {courseContent.map((section, index) => (
          <div key={index}>
            <div className="section-title" onClick = {() => toggleSection(index)}>
              <h2>{section.title}</h2>
              <span>{openSection === index ? '▲' : '▼'}</span>
            </div>
            {openSection === index && (
              <ul className="subsections">
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