package loader

type Section struct {
  ID    int
  Title string
}

type SubSection struct {
  ID        int
  SectionID int
  Title     string
}

type File struct {
  ID           int
  SubSectionID int
  FileType     string
  FilePath     string
}
