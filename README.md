# Jaewoo Oh

개인 포트폴리오. HTML, CSS, JavaScript만 사용합니다.

## 구성

```text
index.html            영문 페이지
ko.html               한국어 페이지
assets/
  profile.webp        프로필 사진
  css/
    base.css          색상, 글꼴, 기본 요소
    layout.css        헤더, 내비게이션, 푸터
    sections.css      소개, 학력, 연구, 프로젝트
  js/
    theme.js          테마 초기화, 전환, 저장
    site.js           사진, 프로젝트 필터·정렬, 내비게이션, 인쇄
```

두 페이지는 같은 스타일과 동작을 공유합니다. 반응형·인쇄 스타일은 각 CSS 파일 하단에 있습니다.

## 로컬 실행

저장소 루트에서 실행한 뒤 `http://localhost:8000`을 엽니다.

```sh
python -m http.server 8000
```

별도 설치나 빌드 과정은 없습니다.

## 수정

소개와 연구·프로젝트 내용은 각 언어의 HTML에서 수정합니다. 프로젝트를 추가할 때는 해당 연도의 `.year-projects`에 `.project-item`을 넣고 `data-category`를 지정합니다. 복수 분야는 `data-category="app llm"`처럼 공백으로 구분합니다.

필터 안내와 테마 버튼 문구는 HTML의 `data-label`, `data-light-label`, `data-dark-label`에 있습니다. 프로필 사진의 표시 배율은 `layout.css`의 `.profile-photo img`에서 조절합니다.

`main` 브랜치 변경 사항은 GitHub Pages에 자동 반영됩니다.
