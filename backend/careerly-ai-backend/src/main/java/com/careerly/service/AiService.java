
package com.careerly.service;

import java.util.Locale;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    public String ask(String prompt) {
        String text = prompt == null ? "" : prompt.toLowerCase(Locale.ROOT);

        if (text.contains("analyze this resume") || text.contains("resume")) {
            return """
                    CAREERLY.AI — DEMO RESUME FEEDBACK

                    Note: This is sample feedback, not an actual resume analysis.

                    1. Strengths to demonstrate
                    - Java programming fundamentals
                    - Object-Oriented Programming (OOP)
                    - Problem-solving and coding practice

                    2. Skills to consider
                    - Data Structures and Algorithms
                    - SQL and database concepts
                    - Spring Boot and REST APIs
                    - Git and GitHub

                    3. Improvements
                    - Add 2-3 relevant projects.
                    - Describe your own contribution to each project.
                    - Include measurable results where accurate.
                    - Keep formatting clear and consistent.

                    4. Seven-day action plan
                    Day 1: Review your resume.
                    Day 2: Revise Java and OOP.
                    Day 3: Practice arrays and strings.
                    Day 4: Learn SQL basics.
                    Day 5: Build a small Java project.
                    Day 6: Upload the project to GitHub.
                    Day 7: Review and improve your resume.

                    Upload a real resume and connect an AI provider
                    later for personalized analysis.
                    """;
        }

        if (text.contains("roadmap") || text.contains("4-week career")) {
            return """
                    CAREERLY.AI — DEMO CAREER ROADMAP

                    Week 1: Java Fundamentals
                    - Practice variables, loops, arrays and methods.
                    - Solve 2 coding problems daily.
                    Goal: Write basic Java programs independently.

                    Week 2: OOP and DSA
                    - Learn classes, objects, inheritance and interfaces.
                    - Practice arrays, strings and searching.
                    Goal: Solve beginner coding problems.

                    Week 3: SQL and Backend
                    - Learn SQL, JDBC and Spring Boot basics.
                    - Build a simple REST API.
                    Goal: Create a working backend project.

                    Week 4: Project and Placement
                    - Finish a Java project and upload it to GitHub.
                    - Revise OOP, SQL and DSA.
                    - Practice interview questions.
                    Goal: Have one project ready to demonstrate.

                    Daily routine: 1 hour learning, 1 hour coding,
                    and 30 minutes revision.

                    This is a sample roadmap. Adjust it to your level.
                    """;
        }

        if (text.contains("interview")) {
            return """
                    CAREERLY.AI — DEMO INTERVIEW PREPARATION

                    Start with these Java interview questions:

                    1. What is Java?
                    2. What is the difference between a class and an object?
                    3. Explain the four pillars of OOP.
                    4. What is the difference between == and equals()?
                    5. What is inheritance?
                    6. What is an interface?
                    7. What is exception handling?
                    8. What is a collection in Java?
                    9. What is the difference between ArrayList and LinkedList?
                    10. What is a REST API?

                    Practice answering each question in simple English.
                    This is a predefined demo response.
                    """;
        }

        if (text.contains("dsa") || text.contains("data structures")
                || text.contains("leetcode") || text.contains("coding")) {
            return """
                    CAREERLY.AI — DEMO DSA PLAN

                    Step 1: Arrays and Strings
                    Step 2: Time and Space Complexity
                    Step 3: Searching and Sorting
                    Step 4: HashMap and HashSet
                    Step 5: Linked Lists
                    Step 6: Stacks and Queues
                    Step 7: Recursion and Backtracking
                    Step 8: Trees and Binary Search Trees
                    Step 9: Heaps and Graphs
                    Step 10: Dynamic Programming

                    Use Java for practice. Start with easy problems,
                    understand the solution, then solve it independently.

                    Suggested routine: 2 problems daily and revise
                    previously solved questions every weekend.
                    """;
        }

        if (text.contains("java")) {
            return """
                    CAREERLY.AI — DEMO JAVA LEARNING PLAN

                    1. Learn variables, data types and operators.
                    2. Practice if-else, loops and methods.
                    3. Learn arrays and strings.
                    4. Understand classes and objects.
                    5. Study inheritance, polymorphism and abstraction.
                    6. Learn exception handling and collections.
                    7. Practice DSA problems using Java.
                    8. Learn SQL, Spring Boot and REST APIs.
                    9. Build a Java project and publish it on GitHub.

                    Daily plan:
                    - 30 minutes learning concepts.
                    - 60 minutes writing code.
                    - 30 minutes solving problems.

                    This is a sample response, not a live AI answer.
                    """;
        }

        return """
                Welcome to Careerly.ai Demo Mode!

                I can show sample guidance for:
                - Java developer learning plans
                - DSA and coding practice
                - Interview preparation
                - Four-week career roadmaps
                - Resume improvement suggestions

                Try asking:
                "Help me create a Java developer learning plan."

                Demo Mode uses predefined responses. It does not call
                an external AI provider or require API credits.
                """;
    }
}
