#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#define ATTEMPTS 15
#define TRUE 1
#define FALSE 0
#define MAX_WORDS 100
#define MAX_LENGTH 20
#define WIN 1
#define LOSE 0

int read_file(char* filename, char words[MAX_WORDS][MAX_LENGTH]);
int has_solved(char* answer, int solution_length);
int get_random_index(int number);
int play_game(char* word, char* player_answer, int solution_length);

int main(int argc, char* argv[])
{
    srand((unsigned)time(NULL));
    if (argc != 2) {
        printf("Usage: %s filename\n", argv[0]);
    }
    else {
        char* filename = argv[1];
        char words[MAX_WORDS][MAX_LENGTH];
        int count = read_file(filename, words);
        int rand_index = get_random_index(count);
        char* solution = words[rand_index];
        int solution_length = strlen(solution);
        char player_answer[MAX_LENGTH];
        for (int i = 0; i < MAX_LENGTH; i++) {
            if (i < solution_length) {
                player_answer[i] = '_';
            }
            else {
                player_answer[i] = '\0';
            }
        }
        int outcome = play_game(solution, player_answer, solution_length);
        if (outcome == WIN) {
            printf("Congratulations! You have won!\n");
        }
        else {
            printf("You have not won! The solution is %s\n", solution);
            printf("Try again!\n");
        }
    }
    return 0;
}

int get_random_index(int number) {
    int rand_index = rand() % number;
    return rand_index;
}

int read_file(char* filename, char words[MAX_WORDS][MAX_LENGTH]) {
	FILE *file;
	char word[20];
	file = fopen(filename, "r");
	int j = 0;
	while (fscanf(file, " %s", word) != EOF) {
		for (int i = 0; i < strlen(word) + 1; ++i) {
		words[j][i] = word[i];
		if (i == strlen(word)) {
			words[j][i] = '\0';
		}
		}
		j++;
	}
	return j;
}

int has_solved(char* answer, int solution_length) {
	int i;
	for (i = 0; i < solution_length; ++i){
		if (answer[i] == '_') {
			return 0;
		}
	}
	return 1;
}

int play_game(char* word, char* player_answer, int solution_length) {
	int a = ATTEMPTS;
	while (a > 0 && has_solved(player_answer, solution_length) == 0) {
		printf("Please enter a letter: ");
		char guess[1];
		scanf(" %c", guess);
		int i;
		for (i = 0; i < strlen(word); ++i) {
			if (word[i] == guess[0]) {
				player_answer[i] = guess[0];
			}
		}
		int k;
		for (k = 0; k < strlen(player_answer); ++k) {
			printf("%c ", player_answer[k]);
		}
		printf("\n");
		a--;
	}
	if (has_solved(player_answer, solution_length) == 1) {
		return WIN;
	}
	else {
	return LOSE;
	}
}
	