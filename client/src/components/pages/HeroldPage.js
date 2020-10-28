import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ProfileViewer from '../ProfileViewer/ProfileViewer';

import { setActiveInterval } from '../../data/usefullFN';
import { updateActive } from '../../data/actions/generalActions';



const HeroldPage = ({ player, isLogged }) => {

    const [playerLogged, setPlayerLog] = useState(false)

    useEffect(() => {
        if (isLogged === "logged") {
            setPlayerLog(true);
            updateActive(player)
            const myInterval = setInterval(updateActive(player), 300000);
            setTimeout(() => {
                clearInterval(myInterval);
            }, 900000)
            return function cleanup() {
                clearInterval(myInterval);
            }
        }
    }, [isLogged])

    return (
        <section className="heroldPage mainPage">

            <h4 className="note">Herold</h4>
            <p className="test">Witaj {player.name ? player.name : player.login}</p>
            <p className="test">Rozgość się. </p>
            <p className="test">Póki co nie ma tu wielu możliwości, lecz każdego dnia krok po kroczku coś nowego jest dodawane.</p>
            <p className="test">Ostatnio zmienił się trochę układ strony, a także dodałem możliwość nadania imienia swojej postaci w dziale <strong>KP</strong>.</p>
            <p className="test"><strong>Changelog:</strong></p>
            <p className="test"><strong>27.10:</strong> - Od dzisiaj możecie mieć avatary. W <strong>Ustawieniach</strong> znajdziecie przycisk Dodaj Avatar. Od razu wprowadziłem ograniczenie do 100kb, a także wielkości wyświetlania. Avatary wyświetlają się w KP. Nad szybszym ich wyświetlaniem się będę oczywiście pracował, sukcesem jest to, ze to w ogóle działa.</p>
            <p className="test next"> - Jeśli wejdziecie w KP i będzie to wasza Karta Postaci to będziecie mieli dostępny przycisk "Edytuj Zakładkę". Treść, którą chcecie edytować pojawia się oczywiście od razu w edytorze.</p>
            <p className="test next"> - wprowadziłem mały feature do Edytora, a także znalazłem sposób na korzystanie z innego - mianowicie, na dole w trakcie pisania widzicie <strong>Words</strong>, które zlicza wam słowa, kliknięcie tego słówka zmienia liczenie na Litery. Jeśli z kolei kliknie się ostatnią od lewej lub pierwszą od prawej ikonkę na pasku narzędzi to wyświetli się okienko, które poinformuje piszącego ile słów, a także ile liter nie licząc spacji napisał w tym odpisie.</p>
            <p className="test"><strong>26.10: </strong> - Dokończyłem Kreator Postaci. W pierwszy etapie imię, rasa i klasa, w drugim trochę więcej, wstępna metryka również. Usunąłem wam wiek, więc po wejściu na <strong>Kartę Postaci</strong> wywoła wam się właśnie Etap II. Po uzupełnieniu przeniesie was do waszego profilu gracza. Tak jakbyście kliknęli na swój link na liście.</p>
            <p className="test next"> - Znowu usunąłem wam profile, ponieważ w KP macie przycisk "Dodaj Zakładkę Profilu", domyślnie nie posiadacie żadnych, pisząc w ten sposób dodajecie treść i nazwę zakladki ręcznie, w ciut późniejszym etapie powinno działać linkowanie pomiędzy waszymi zakładkami.</p>
            <p className="test next"><strong> - dodałem Edytor Tekstu</strong>, który działa w nieco lepszy sposób. Dowolne formatowanie, pogrubianie, podkreślanie, akapity, kolory, zdjęcia (ciut później), linki, nawet możliwość robienia nagłówków jak i mniejszych przypisów. Póki co kosztem bbCode. Jeśli działa [b]to[/b] to nie działają inne funcjonalności, dla mnie wybór jest prosty. Zrobiłem pierwsze testy Edytora, będę to dopracowywał na spokojnie w dalszym terminie.</p>
            <p className="test next"> - poprawiłem trochę działanie "czasu rzeczywistego" na grze, podobnie jak edycji profilu.</p>

            <p className="test"><strong>25.10: </strong> - Wprowadziłem powiadamianie o nowych odpisach w globalu, nowych sesjach prywatnych i ich odpisach, a także nowych wiadomościach w trybie rzeczywistym. Musiałem usunąć przed tym wszystkie sesje globalne i prywatne, a także wszystkie maile żeby nie było konfliktów po stronie serwera. Od dziś, bez przetestowania tego przez was nie mogę być jednak na 100% pewny, każda nowa rzecz która dotyczy waszej postaci będzie automatycznie odświeżała wam stronę (bez psucia tego, co akurat robicie oczywiście) i zapalała odpowiednie powiadomienie.</p>
            <p className="test next"> - poprawiłem nieco sposób wyświetlania osób aktywnych, każda aktywność na grze przedłuża ten czas o 10 minut, w tym po prostu zmiana strony. Jeśli wejdziecie na którąś ze stron i zostawicie zakładkę otwartą program odświeży waszą aktywność 3 krotnie, a następnie zablokuje dalsze odświeżanie aktywności, więc konto zniknie z listy aktywnych gracz. Nie zablokuje to jednak wysłania odpisu, nie wyloguje was to. Po prostu schowa.</p>
            <p className="test"><strong>22.10: </strong> - przerobiłem podgląd profili/KP innych graczy.Gdy dopracuje Kreator postaci metryka w profilu będzie zawierała najwazniejsze informacje: rase, klase, zawód dla osob które będą chciały go wpisać, wiek, wzrost, wagę, posturę, a także kolor włosów i oczu. Zawsze wkurwiało mnie to, że tak podstawowych informacji trzeba było szukać w treści zamiast mieć to podsumowane.</p>
            <p className="test next"> - zmieniłem sposób wyświetlania graczy, dodałem przycisk Pokaż graczy offline, domyślnie są oni schowani. W późniejszym etapie podgląd graczy zrobię na osobnej stronie, gdzie będzie można ich przeszukiwać za pomocą wybranych przez was filtrów, ale segregacja po rasie, po klasie, etc.</p>
            <p className="test"><strong>21.10: </strong> - naprawiono dwa błędy związane z listą graczy, pierwszy nie pokazujący od razu po zalogowaniu poprawnej listy graczy, drugi związany z tym, że konta na liście potrafiły się dublować.</p>
            <p className="test next"> - W <strong>Ustawieniach</strong> znajdziecie duży przycisk "Wyślij e-mail weryfikacyjny", który wyślę wam na podanego maila wiadomość z linkiem do kliknięcia. Po kliknięciu w niego jeśli wszystko pójdzie dobrze to zostaniecie przelogowani do strony startowej. Rozwiązanie to jest tylko dla was, ponieważ każde nowo założone konto jest weryfikowane od razu z maila startowego. </p>
            <p className="test next"> - naprawiłem błąd, który sprawiał że podmenu Karczm i link do Sesji Prywatnych chował się pod podglądem gracza. </p>
            <p className="test next"> - schowałem Sesje Globalne, obok każdego działu znajduje się teraz przycisk po którego naciśnięciu wyświetlają się sesje które tam się znajdują. Stworzone na propozycję Idki, która zasugerowała, że gdy bedzie ich więcej i widoczne będą wszystkie na raz to będzie rozpierdol.</p>

            <p className="test"><strong>20.10: </strong>Dodano do Poczty możliwość dodawania i usuwania graczy, innymi słowy do robienia konwersacji grupowej. Program działa jak w sesjach Prywatnych, więc jedynie autor, gracz usunięty z poczty zostaje z konwersacji wyrzucony nawet jak ma ją otwartą.</p>
            <p className="test next"> - poprawiono błąd, który w sesjach Prywatnych umożliwiał dodawanie lub usuwanie graczy każdemu z graczy w sesji.</p>
            <p className="test next"> - stworzyłem pierwszą wersję lepszej listy graczy i jednocześnie systemu aktywności na grze. Zalogowanie się, przechodzenie pomiędzy Zakładkami lub odpisywanie na sesje/pocztę/karczmy zapewnia bycie online, co ważne - wpływa to tylko na wyświetlanie się na liście jako gracz online, a nie na to, że nie damy rady zrobić odpisu. Pozostawienie karty samopas, nie pisanie niczego w karczmie, sprawi, że po paru chwilach znikniemy z listy.</p>
            <p className="test"><strong>19.10: </strong>Sesje prywatne zostały dodane jako poddział Sesji ogólnych z osobnym linkiem, przenoszącym od razu do odpowiedniej podstrony. Graczy można dodawać/usuwać przy tworzeniu, a także później już bezpośrednio w sesji, a może robić to jedynie autor sesji.</p>
            <p className="test next"> - poprawiłem notyfikacje dla sesji ogólnych i sesji prywatnych na razie po prostu są pokolorowane, później gdy coś graficznego już się pojawi, będę poprawiał poziom.</p>
            <p className="test next"> - poprawiłem jeszcze jeden błąd z wiekiem, który wciąż umożliwiaj wybranie dowolnego wieku jeśli wybierało się wiek przed wybraniem rasy. W tej chwili potwierdzona rasa jest niezbędna by móc wybrać wiek.</p>
            <p className="test next"> - "wyczyściłem" okna na rasę i klasę w Kreatorze, z racji na to, że bazowe nie wczytywały opisu w momencie otwarcia strony. Teraz ręcznie trzeba wybrać którąś z pozycji, co jednocześnie uruchamia jej podgląd.</p>
            <p className="test"><strong>14.10: </strong>Naprawiony błąd umożliwiający wybieranie dowolnego wieku. Od tej pory wiek minimalny to 16 lat, wiek maksymalny zależny jest od wybranej rasy. Poprawione mniejsze błędy umożliwiające zmienianie rasy/klasy i wieku już po Potwierdzeniu. </p>
            <p className="test next"> - dodana podstrona w sesjach <strong>Sesje prywatne</strong>, a także dodany kreator sesji prywatnej. Dodany - nie ukończony, ale także nie podpięty pod backend, klikanie tam niczego nie zepsuje.</p>

            <p className="test"><strong>13.10: </strong>W Karcie Postaci znajduje się Kreator Postaci zamiast dotychczasowego pola na nadawanie imienia. Póki co oczywiście treść i opcje tylko poglądowe.</p>
            <p className="test next"> - dodałem przycisk i algorytm resetujący KP.</p>
            <p className="test next"> - zamieniłem sposób wyświetlania sesji na listach tak by wyświetlał się jej termin odpisu, a nie czas startu. Czas startu wciąż dostępny wewnątrz sesji.</p>
            <p className="test"><strong>08.10: </strong>Uruchomiłem Termin następnego odpisu. Jeśli gracz jest autorem sesji otwiera mu się nad edytorem odpisu pole do wybrania daty i godziny. Jest to niezbędne do wysłania tego odpisu w ogóle, a w dodatku opatrzone czerwonym i zielonym opisem w zależności od tego czy jest już wypełnione czy nie. Jeśli odpisuje gracz nie będący autorem pola tego w ogóle nie ma.</p>
            <p className="test next"> - zrobiłem Zakładki w panelu bocznym wewnątrz sesji, bazowo otwierają się informacje o niej, lecz jednym kliknięciem można mieć z powrotem dostęp do listy graczy.</p>
            <p className="test"><strong>07.10: </strong>Przebudowałem wstępnie dział Sesji globalnych, dodałem 3 również wstępne działy według których segregowane są sesje globalne. </p>
            <p className="test next">Dodałem Kreator Sesji, który dostępny jest jedynie dla rangi MG lub Admina, wstępnie oczywiście, jego działanie jest banalne - Nadajecie tytuł, wybieracie dział, zostajecie przeniesieni do waszej nowej sesji. <strong>DOPÓKI</strong> nie napiszecie w niej otwarcia sesja ta nie wyświetla się innym graczom na liście sesji. <strong>Wam też nie, więc nie zamknijcie sobie tej strony na którą was przekieruje po założeniu.</strong> Potem to zmienię, dziś taki oszukiwany dzień miałem.</p>
            <p className="test next"> - dodałem roboczo Informacje o Sesji, które wyświetlają się w miejscu Listy Graczy gdy już wejdziecie w jakąś sesję, w późniejszym etapie będzie tam do wyboru Lista Graczy lub właśnie Informacje.</p>
            <p className="test"><strong>06.10: </strong>W <strong>Ustawieniach</strong> dostępne jest narzędzie do zmiany swojej rangi. Później będzie ono dostępne tylko dla odpowiednich grup oczywiście.</p>
            <p className="test next"> - każda osoba po rejestracji ma rangę Przybysza. By móc z niej awansować należy posiadać imię postaci oraz profil. Jutro dodam wyświetlanie rangi w podglądzie konta.</p>
            <p className="test next"> - żeby móc grać w sesjach lub karczmach trzeba mieć rangę Mieszkańca.</p>
            <p className="test next"> - żeby móc usuwać odpisy z sesji lub z karczmy należy mieć rangę Mistrza Gry. Dziś wystarczy kliknąć na X w rogu, jutro zrobię dodatkowe pytanie potwierdzające usunięcie rekordu. </p>
            <p className="test next"> - poprawiłem działanie funkcji wylogowującej, a także wygląd strony dla konta niezalogowanego. </p>
            <p className="test"><strong>05.10: </strong>Zamieniono <strong>wszędzie</strong> wcześniejszy Edytor Tekstowy na pozwalający używać podstawowego na razie stylowania. Pogrubianie, podkreślanie, skreślanie i kursywa.</p>
            <p className="test next"> - uruchomiłem karczmę odświeżającą się w czasie rzeczywistym po dodaniu przez któregokolwiek z graczy na serwerze odpowiedzi. Tę samą użyteczność zaimplementowałem do pojedynczej sesji i pojedynczej konwersacji, jeśli ktoś odpisze w trakcie naszego tworzenia odpisu lista rekordów odświeży się sama.</p>
            <p className="test next"> - stworzony jest nowy system rejestracji i logowania, uwierzytelniający w lepszy sposób, bezpieczniejszy, wysyłający maila weryfikacyjnego po rejestracji. <strong>póki co nie działa weryfikacja maila, przez co nie trzeba go weryfikować by móc się zalogować po raz pierwszy. Zmienimy to w późniejszym czasie.</strong></p>
            <p className="test next"> - <strong>poeksperymentowałem</strong> z logowaniem i wylogowywaniem, by usunąć ciągłe wywołanie strony Logowania po każdym odświeżeniu. Chyba mi się to udało, chociaż mogą pojawiać się błędy. </p>
            <p className="test next"> - dodałem Wylogowanie w Ustawienia - nie działa jednak idealnie, po wylogowaniu trzeba przeładować stronę by link przeniósł ponownie na stronę główną, poprawię to jutro. </p>
            <p className="test next"> - naprawiłem błąd Poczty uniemożliwiający wysłanie więcej niż jednej wiadomości bez wcześniejszego odświeżenia strony lub zmienienia zakładki.</p>


            <p className="test"><strong>27.09: </strong> Dodałem <strong>Podgląd</strong> do profilu, sesji i wiadomości. Textarea z profilu wczytuje już aktualny profil przy edycji. Zmieniłem wyświetlanie się profili w wersji komputerowej.</p>
            <p className="test"><strong>26.09: </strong> Zamieniłem w zakładkach Sesje, Poczta, Karczmy i KP sekcję <strong>Notatnik</strong> w sekcję <strong>Lista graczy</strong>, w której istnieje również podgląd profilu gracza.</p>
            <p className="test next"> - Poczta w wersji BASIC zrobiona. Co znaczy Basic? Że jak będziecie adresować pocztę to sprawdzi listę graczy i podpowie wam o jakiego gracza może wam chodzić po literkach z jego imienia które wpiszecie. A także oznacza to to, że stworzy odpowiednią konwersację, którą wam od razu wyświetli - nowsze u góry. <strong>ALE</strong>... hehe... nie możecie sobie na nie odpisywać. Tym zajmę się już jutro.</p>
            <p className="test next"> - dodałem sesję Uwagi i pomysły, w której chciałbym by dyskutowane były elementy silnika gry. Co można zrobić wg. was lepiej, jaką funkcjonalność jeszcze można dodać. </p>
            <p className="test"><strong>23.09: </strong> <strong>ogłaszam porażkę w związku z BBCodem </strong>- jest to bardzo ważna w TGFie część, lecz przerastająca mnie w tym momencie. Będę wracał do tej części kodu regularnie, a o wynikach informował później.</p>
            <p className="test next"> - zrobiony z zakładce KP komponent obsługujący stworzenie profilu, a także jego ewentualną zmianę.</p>
            <p className="test next"> - zrobione w zakładce Ustawienia komponent umożliwiający aktywnego 7 dni autologa.</p>
            <p className="test next"> - zrobiony w zakładce KP podstawowy komponent będący Listą Graczy (aktywnych, czyli posiadających imię i profil), a także podgląd tychże graczy.</p>
            <p className="test"><strong>22.09: </strong> BBcode zrobiony po łebkach, szczegóły w sesji. Odkładam go na później, bo moja psychika nie zniesie takiej walki bez efektów. Na wersję beta wystarczy. <strong>Nie zamknięcie tagu pogrubi wam całą sesję, ale nie ruszy następnych postów.</strong></p>
            <p className="test"><strong>21.09: </strong> naprawione błędne wyświetlanie się wiadomości, które pomimo "entera" wyświetlały się w 1 linii. Dodane zostały <strong>powiadomienia</strong> dla wersji komputerowej i mobilnej, choć nie odznaczają one linku w trybie natychmiastowym. Potrzebna jest jakaś aktywność, np przejście na inną zakładkę. </p>
            <p className="test"><strong>18.09: </strong>naprawiony został błąd, który "pozornie" nadawał imię, pozwalając odpisać w sesji, a nie zapisywał go w bazie danych. Błąd występował jeśli próbowało się nadać imię w tej samej sesji w której nastąpiła rejestracja konta.</p>
            <p className="test"><strong>17.09: </strong>zrobiona została podstrona obsługująca sesje, a także działające pole odpisu, bez żadnej waloryzacji póki co jednak.</p>
            <p className="test"><strong>17.09: </strong>w dziale KP został wrzucony wstęp do Kreatora Postaci, który umożliwia nadawanie, a także późniejsze zmienianie imienia swojej postaci. Nadanie imienia postaci jest niezbędne by móc odpisać w sesjach.</p>

            <section className="notepad">
                {playerLogged ? <ProfileViewer /> : null}
            </section>

        </section>
    );
}

const MapStateToProps = (state) => ({
    player: state.player.player,
    isLogged: state.player.isLogged,
})

export default connect(MapStateToProps)(HeroldPage);